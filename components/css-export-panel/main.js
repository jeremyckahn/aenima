define([

  'lateralus'
  ,'mustache'

  ,'./model'
  ,'./view'
  ,'text!./template.mustache'
  ,'text!./templates/beacon-rule.mustache'

], function (

  Lateralus
  ,Mustache

  ,Model
  ,View
  ,template
  ,beaconRuleTemplate

) {
  'use strict';

  var Base = Lateralus.Component;

  var CssExportPanelComponent = Base.extend({
    name: 'css-export-panel'
    ,Model: Model
    ,View: View
    ,template: template

    ,provide: {
      /**
       * @return {string}
       */
      cssTrackingCode: function () {
        return Mustache.render(beaconRuleTemplate, this.model.toJSON());
      }
    }

    /**
     * @return {{
     *   name: string,
     *   fps: number,
     *   vendors: Array.<string>
     * }}
     */
    ,toJSON: function () {
      return this.view.toJSON();
    }
  });

  return CssExportPanelComponent;
});
