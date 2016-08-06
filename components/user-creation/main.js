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

  var UserCreationComponent = Base.extend({
    name: 'user-creation'
    ,View: View
    ,Model: Model
    ,template: template

    ,lateralusEvents: {
    }

    ,initialize: function () {
    }
  });

  return UserCreationComponent;
});
