define([

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var CssExportPanelComponentModel = Base.extend({
    defaults: {
      cssExportClass: ''
      ,analyticsUrl: ''
    }

    /**
     * Parameters are the same as http://backbonejs.org/#Model-constructor
     * @param {Object} [attributes]
     * @param {Object} [options]
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return CssExportPanelComponentModel;
});
