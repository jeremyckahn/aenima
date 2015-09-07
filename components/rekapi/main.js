define([

  'underscore'
  ,'lateralus'

  ,'./models/actor'
  ,'./models/keyframe-property'

  ,'./collections/keyframe-property'

  ,'rekapi'

  ,'aenima.utils'

], function (

  _
  ,Lateralus

  ,ActorModel
  ,KeyframePropertyModel

  ,KeyframePropertyCollection

  ,Rekapi

  ,utils

) {
  'use strict';

  var Base = Lateralus.Component;

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
        delete this.bezierCurves[curveName];
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
    }

    ,initialize: function () {
      this.rekapi = new Rekapi(document.createElement('div'));
      this.isPerformingBulkOperation = false;
      this.bezierCurves = {};

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
      if (this.isPerformingBulkOperation) {
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
      var bezierCurveJson = bezierComponentModel.toJSON();
      this.bezierCurves[bezierCurveJson.name] = bezierCurveJson;
      this.doTimelineUpdate();
    }
  });

  RekapiComponent.ActorModel = ActorModel;
  RekapiComponent.KeyframePropertyModel = KeyframePropertyModel;
  RekapiComponent.KeyframePropertyCollection = KeyframePropertyCollection;

  utils.proxy(Rekapi, RekapiComponent, {
    blacklistedMethodNames: ['on', 'off']
    ,subject: function () {
      return this.rekapi;
    }
  });

  return RekapiComponent;
});
