define([

  'lateralus'

  ,'./view'
  ,'./model'
  ,'text!./template.mustache'

], function (

  Lateralus

  ,View
  ,Model
  ,template

) {
  'use strict';

  var Base = Lateralus.Component;

  var UserDisplayComponent = Base.extend({
    name: 'user-display'
    ,View: View
    ,Model: Model
    ,template: template

    ,lateralusEvents: {
    }

    ,initialize: function () {
    }
  });

  return UserDisplayComponent;
});
