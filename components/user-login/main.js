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

  var UserLoginComponent = Base.extend({
    name: 'user-login'
    ,View: View
    ,Model: Model
    ,template: template

    ,lateralusEvents: {
    }

    ,initialize: function () {
    }
  });

  return UserLoginComponent;
});
