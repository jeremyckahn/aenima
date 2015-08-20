define([

  'lateralus'

], function (

  Lateralus

) {
  'use strict';

  var Base = Lateralus.Component.Model;
  var baseProto = Base.prototype;

  var ExportPanelComponentModel = Base.extend({
    defaults: {
      cssExportClass: ''
      ,analyticsUrl: ''
      ,enableOrientationControls: true
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

  return ExportPanelComponentModel;
});
