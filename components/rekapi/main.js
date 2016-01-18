define([

  'underscore'
  ,'lateralus'

  ,'./models/actor'
  ,'./models/keyframe-property'

  ,'./collections/keyframe-property'

  ,'rekapi'

  ,'aenima.utils'

  ,'aenima.constant'

], function (

  _
  ,Lateralus

  ,ActorModel
  ,KeyframePropertyModel

  ,KeyframePropertyCollection

  ,Rekapi

  ,utils

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component;
  var $doc = $(document.documentElement);

  var RekapiComponent = Base.extend({
    name: 'aenima-rekapi'

    ,ActorModel: ActorModel

    ,provide: {
      /**
       * @return {Object}
       */
      timelineExport: function () {
        return this.exportTimeline();
      }

      /**
       * @param {Object} cssOpts Gets passed to Rekapi.DOMRenderer#toString.
       * @return {string}
       */
      ,cssAnimationString: function (cssOpts) {
        var cssAnimationString = this.rekapi.renderer.toString(cssOpts);
        cssAnimationString += this.collectOne('cssTrackingCode');

        return cssAnimationString;
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
        this.playFromCurrent();
      }

      ,userRequestPlay: function () {
        this.playFromCurrent();
      }

      ,userRequestPause: function () {
        this.pause();
      }

      ,userRequestStop: function () {
        this.stop().update(0);
      }

      /**
       * @param {number} millisecond
       */
      ,userRequestSetPlayheadMillisecond: function (millisecond) {
        this.update(millisecond);
      }

      ,userRequestTogglePreviewPlayback: function () {
        this[this.isPlaying() ? 'pause' : 'playFromCurrent']();
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

      var rekapiEventNames = this.getEventNames();
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

      this.update();
      this.emit('rekapi:timelineModified', this.rekapi);
    }

    ,setupActor: function () {
      var newActor = this.addActor();
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

      var currentState = JSON.stringify(this.exportTimeline());

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
      this.importTimeline(previousState);
      this.update(Math.min(currentMillisecond, this.getAnimationLength()));
      this.rekapi.trigger('timelineModified');
      this.emit('revertedToPreviousState');
    }

    /**
     * To be overridden by subclasses
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
  });

  RekapiComponent.ActorModel = ActorModel;
  RekapiComponent.KeyframePropertyModel = KeyframePropertyModel;
  RekapiComponent.KeyframePropertyCollection = KeyframePropertyCollection;

  utils.proxy(Rekapi, RekapiComponent, {
    blacklistedMethodNames: ['on', 'off', 'trigger']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiComponent;
});
