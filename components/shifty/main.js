define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'aenima/constant'

], function (

  _
  ,Lateralus
  ,shifty

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component;
  const { Tweenable, setBezierFunction, unsetBezierFunction } = shifty;

  var ShiftyComponent = Base.extend({
    name: 'aenima-shifty'

    ,lateralusEvents: {
      requestNewCurve: function () {
        this.addNewCurve();
      }

      ,userRequestedNewCurve: function () {
        this.addNewCurve();
      }

      /**
       * @param {{
       *   name: string,
       *   x1: number,
       *   y1: number,
       *   x1: number,
       *   y1: number
       * }} curveObject
       */
      ,setCustomCurve: function (curveObject) {
        this.setCurve(
          curveObject.displayName
          ,curveObject.x1
          ,curveObject.y1
          ,curveObject.x2
          ,curveObject.y2
        );
      }
      ,userRequestResetAnimation: function () {
        this.resetCustomCurves();
      }

      ,requestClearTimeline: function () {
        this.resetCustomCurves();
      }

      ,quarantineCustomCurves: function () {
        this.quarantineCustomCurves();
      }

      ,unquarantineCustomCurves: function () {
        this.unquarantineCustomCurves();
      }
    }

    ,provide: {
      customCurves: function () {
        return this.getCustomCurves();
      }
    }

    ,initialize: function () {
      this.quarantinedCustomCurves = [];
    }

    ,addNewCurve: function () {
      var newCurveName =
        constant.CUSTOM_CURVE_PREFIX + (this.getCustomCurveCount() + 1);
      setBezierFunction(
        newCurveName
        ,0.25
        ,0.5
        ,0.75
        ,0.5
      );

      this.emit('tweenableCurveCreated', newCurveName);
    }

    /**
     * @param {string} name
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
    ,setCurve: function (name) {
      setBezierFunction.apply(Tweenable, arguments);
      this.emit('tweenableCurveCreated', name);
    }

    ,resetCustomCurves: function () {
      var customCurveNames = this.getCustomCurveNameList();

      customCurveNames.forEach(function (curveName) {
        unsetBezierFunction(curveName);
        this.emit('unsetBezierFunction', curveName);
      }, this);

      this.addNewCurve();
    }

    /**
     * @return {Array.<string>}
     */
    ,getCustomCurveNameList: function () {
      var curveNames = _.map(Tweenable.formulas,
          function (curve, curveName) {
        return curveName;
      });

      return curveNames.filter(function (curveName) {
        return curveName.match('^custom');
      });
    }

    /**
     * @return {Array.<Function>}
     */
    ,getCustomCurves: function () {
      return _.filter(Tweenable.formulas,
          function (curve, curveName) {
        return curveName.match('^custom');
      });
    }

    /**
     * @return {number}
     */
    ,getCustomCurveCount: function () {
      return this.getCustomCurves().length;
    }

    ,quarantineCustomCurves: function () {
      this.quarantinedCustomCurves = this.getCustomCurves();
    }

    ,unquarantineCustomCurves: function () {
      this.quarantinedCustomCurves.forEach(function (customCurve) {
        setBezierFunction(
          customCurve.displayName
          ,customCurve.x1
          ,customCurve.y1
          ,customCurve.x2
          ,customCurve.y2
        );
      });
    }
  });

  return ShiftyComponent;
});
