define([

  'lateralus'

  ,'./view'
  ,'./model'
  ,'text!./template.mustache'

  ,'aenima.component.bezierizer'

], function (

  Lateralus

  ,View
  ,Model
  ,template

  ,BezierizerComponent

) {
  'use strict';

  var Base = Lateralus.Component;

  var MotionPanelComponent = Base.extend({
    name: 'motion-panel'
    ,View: View
    ,Model: Model
    ,template: template

    ,initialize: function () {
      this.bezierizerComponent = this.addComponent(BezierizerComponent, {
        el: this.view.$bezierizer
      });

      this.listenFor(
        'tweenableCurveCreated'
        ,this.onTweenableCurveCreated.bind(this)
      );
    }

    /**
     * @param {string} curveName
     */
    ,onTweenableCurveCreated: function (curveName) {
      this.view.selectCurve(curveName);
    }

    /**
     * @return {{
     *   isCentered: boolean,
     *   iterations: boolean|undefined
     * }}
     */
    ,toJSON: function () {
      return this.view.toJSON();
    }
  });

  return MotionPanelComponent;
});