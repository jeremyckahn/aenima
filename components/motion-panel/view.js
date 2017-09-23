define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'../curve-selector/main'

], function (

  _
  ,Lateralus
  ,shifty

  ,template

  ,CurveSelectorComponent

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;
  const { Tweenable } = shifty;

  var MotionPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userRequestUpdateCenteringSettingViaKeybinding: function () {
        if (this.$showPath) {
          this.$showPath.click();
        }
      }

      ,userRequestUpdateOnionSkinSettingViaKeybinding: function () {
        if (this.$showOnionSkin) {
          this.$showOnionSkin.click();
        }
      }

      ,selectFirstCurve: function () {
        if (!this.$curveSelector.children().length) {
          this.curveSelectorView.render();
        }

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

      ,requestClearTimeline: function () {
        this.$curveSelector.empty();
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

      ,'change .show-onion-skin': function () {
        var showOnionSkin = this.$showOnionSkin.is(':checked');
        this.lateralus.model.setUi('showOnionSkin', showOnionSkin);
        this.emit('userRequestUpdateOnionSkinSetting', showOnionSkin);
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
      this.curveSelectorView = this.addSubview(CurveSelectorComponent.View, {
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
      var curveFn = Tweenable.formulas[curveName];
      var modelProps = _.pick(curveFn, 'displayName', 'x1', 'y1', 'x2', 'y2');
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
