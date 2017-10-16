define([

  'jquery'
  ,'underscore'
  ,'lateralus'

  ,'./models/actor'
  ,'./models/keyframe-property'

  ,'./collections/keyframe-property'

  ,'rekapi'

  ,'aenima/utils'

  ,'aenima/constant'

], function (

  $
  ,_
  ,Lateralus

  ,ActorModel
  ,KeyframePropertyModel

  ,KeyframePropertyCollection

  ,rekapi

  ,utils

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component;
  var baseProto = Base.prototype;
  var $doc = $(document.documentElement);
  const { Rekapi, DOMRenderer } = rekapi;

  var RekapiComponent = Base.extend({
    name: 'aenima-rekapi'

    ,ActorModel: ActorModel

    ,provide: {
      // TODO: Try to remove one of these methods?  They're redundant now.
      /**
       * @return {Object}
       */
      timelineExport: function () {
        return this.rekapi.exportTimeline();
      }

      /**
       * @return {Object}
       */
      ,rawRekapiExport: function () {
        return this.rekapi.exportTimeline();
      }

      /**
       * @param {Object} cssOpts Gets passed to Rekapi.DOMRenderer#toString.
       * @return {string}
       */
      ,cssAnimationString: function (cssOpts) {
        var cssAnimationString =
          this.rekapi.getRendererInstance(DOMRenderer)
            .getCss(cssOpts);

        cssAnimationString += this.collectOne('cssTrackingCode');

        return cssAnimationString;
      }

      ,isPlaying: function () {
        return this.rekapi.isPlaying();
      }
    }

    ,lateralusEvents: {
      /**
       * @param {BezierizerComponentModel} bezierComponentModel
       */
      bezierCurveUpdated: function (bezierComponentModel) {
        this.saveBezierCurve(bezierComponentModel);
      }

      /**
       * @param {string} curveName
       */
      ,unsetBezierFunction: function (curveName) {
        delete this.curves[curveName];
        this.doTimelineUpdate();
      }

      ,requestPlay: function () {
        this.rekapi.playFromCurrent();
      }

      ,userRequestPlay: function () {
        this.rekapi.playFromCurrent();
      }

      ,requestPause: function () {
        this.rekapi.pause();
      }

      ,userRequestPause: function () {
        this.rekapi.pause();
      }

      ,userRequestStop: function () {
        this.rekapi.stop().update(0);
      }

      /**
       * @param {number} millisecond
       */
      ,userRequestSetPlayheadMillisecond: function (millisecond) {
        this.rekapi.update(millisecond);
      }

      ,userRequestTogglePreviewPlayback: function () {
        this.rekapi[this.rekapi.isPlaying() ? 'pause' : 'playFromCurrent']();
      }

      ,requestRecordUndoState: function () {
        this.recordUndoState();
      }

      ,requestClearUndoStack: function () {
        this.undoStateStack.length = 0;
      }
    }

    ,initialize: function () {
      this.rekapi = new Rekapi(document.createElement('div'));
      this.isPerformingBulkOperation = false;
      this.curves = {};
      this.undoStateStack = [];

      var rekapiEventNames = this.rekapi.getEventNames();
      var whitelistedRekapiEventNames =
        _.without(rekapiEventNames, 'timelineModified');

      // Amplify all Rekapi events as "rekapi:" lateralusEvents.
      whitelistedRekapiEventNames.forEach(function (eventName) {
        this.rekapi.on(eventName, function () {
          this.emit.apply(
            this, ['rekapi:' + eventName].concat(_.toArray(arguments)));
        }.bind(this));
      }.bind(this));
    }

    ,doTimelineUpdate: function () {
      if (this.isPerformingBulkOperation ||
          this.lateralus.model.get('isLoadingTimeline')) {
        return;
      }

      this.rekapi.update();
      this.emit('rekapi:timelineModified', this.rekapi);
    }

    ,setupActor: function () {
      var newActor = this.rekapi.addActor();
      this.actorModel = this.initModel(this.ActorModel, {}, {
        rekapiComponent: this
        ,actor: newActor
      });

      this.listenTo(
        this.actorModel
        ,'change'
        ,this.doTimelineUpdate.bind(this)
      );
    }

    /**
     * Prevent repeated calls to this.rekapi.update() until
     * endBulkKeyframeOperation is called.
     */
    ,beginBulkKeyframeOperation: function () {
      this.isPerformingBulkOperation = true;
    }

    ,endBulkKeyframeOperation: function () {
      this.isPerformingBulkOperation = false;
      this.doTimelineUpdate();
    }

    ,clearCurrentAnimation: function () {
      this.actorModel.removeAllKeyframes();
    }

    /**
     * @param {BezierizerComponentModel} bezierComponentModel
     */
    ,saveBezierCurve: function (bezierComponentModel) {
      var curveJson = bezierComponentModel.toJSON();
      this.curves[curveJson.displayName] = curveJson;
      this.doTimelineUpdate();
    }

    ,recordUndoState: function () {
      if (this.lateralus.model.get('doPreventUndoRecording')) {
        return;
      }

      var currentState = JSON.stringify(this.toJSON());

      if (currentState === _.last(this.undoStateStack)) {
        return;
      }

      this.undoStateStack.push(currentState);
      var undoStateStackLength = this.undoStateStack.length;

      if (undoStateStackLength < constant.UNDO_STACK_LIMIT) {
        this.undoStateStack =
          this.undoStateStack.slice(
            undoStateStackLength - constant.UNDO_STACK_LIMIT
            ,constant.UNDO_STACK_LIMIT
          );
      }
    }

    ,revertToPreviouslyRecordedUndoState: function () {
      if (!this.undoStateStack.length) {
        return;
      }

      var previousState = JSON.parse(this.undoStateStack.pop());

      // Cause all $.fn.dragon drags to end
      $doc.trigger('mouseup');

      var currentMillisecond = this.rekapi.getLastMillisecondUpdated();
      this.removeCurrentTimeline();
      this.fromJSON(previousState);
      this.rekapi.update(
        Math.min(currentMillisecond, this.rekapi.getAnimationLength())
      );
      this.rekapi.trigger('timelineModified');
      this.emit('revertedToPreviousState');
    }

    /**
     * To be overridden by subclasses (specifically Mantra)
     * @abstract
     */
    ,removeCurrentTimeline: function () {}

    /**
     * Overrides Rekapi's removeAllActors method.
     * @override
     */
    ,removeAllActors: function () {
      var rekapi = this.rekapi;

      // Each actor must be removed individually so the rekapi:removeActor
      // event is fired
      _.each(rekapi.getAllActors(), function (actor) {
        rekapi.removeActor(actor);
      }, this);
    }

    /**
     * Set view-level state data
     * @abstract
     */
    ,fromJSON: function () {}

    /**
     * Return current view-level state data
     * @abstract
     */
    ,toJSON: function () {}

    ,dispose: function () {
      this.rekapi.stop();
      baseProto.dispose.apply(this, arguments);
    }
  });

  RekapiComponent.ActorModel = ActorModel;
  RekapiComponent.KeyframePropertyModel = KeyframePropertyModel;
  RekapiComponent.KeyframePropertyCollection = KeyframePropertyCollection;

  return RekapiComponent;
});
