define([

  'underscore'
  ,'lateralus'

  ,'./view'
  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,View
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var ControlPanelComponent = Base.extend({
    name: 'control-panel'
    ,View: View
    ,template: template
  });

  return ControlPanelComponent;
});
