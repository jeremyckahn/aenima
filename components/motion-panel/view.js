define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'aenima.component.curve-selector'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,CurveSelectorComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var MotionPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userRequestUpdateCenteringSettingViaKeybinding: function () {
        if (this.$showPath) {
          this.$showPath.click();
        }
      }

      ,selectFirstCurve: function () {
        var $firstCurve = this.$curveSelector.children(':first');
        this.selectCurve($firstCurve.val());
      }

      /**
       * @param {string} curveName
       */
      ,unsetBezierFunction: function (curveName) {
        var $optionToRemove = this.$curveSelector.children().filter(
            function () {
          return this.value === curveName;
        });

        $optionToRemove.remove();
      }
    }

    ,events: {
      'click .add-curve': function () {
        this.emit('userRequestedNewCurve');
      }

      ,'change .show-path': function () {
        var showPath = this.$showPath.is(':checked');
        this.lateralus.model.setUi('showPath', showPath);
        this.emit('userRequestUpdateShowPathSetting', showPath);
      }

      ,'change .center-to-path': function () {
        var centerToPath = this.$centerToPath.is(':checked');
        this.lateralus.model.setUi('centerToPath', centerToPath);
        this.emit('userRequestUpdateCenteringSetting', centerToPath);
      }

      ,'change .curve-selector': function () {
        this.selectCurve(this.$curveSelector.val());
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
      this.addSubview(CurveSelectorComponent.View, {
        el: this.$curveSelector
        ,onlyShowCustomCurves: true
      });
    }

    /**
     * @override
     */
    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, this.lateralus.model.get('ui'));

      return renderData;
    }

    /**
     * @param {string} curveName
     */
    ,selectCurve: function (curveName) {
      this.$curveSelector.val(curveName);
      var curveFn = Tweenable.prototype.formula[curveName];
      var modelProps = _.pick(curveFn, 'x1', 'y1', 'x2', 'y2');
      modelProps.name = curveName;
      this.component.bezierizerComponent.model.set(modelProps);
    }

    /**
     * @return {{
     *   isCentered: boolean,
     * }}
     */
    ,toJSON: function () {
      var $centerToPath = this.$centerToPath;

      return {
        isCentered: $centerToPath ? $centerToPath.is(':checked') : false
      };
    }
  });

  return MotionPanelComponentView;
});