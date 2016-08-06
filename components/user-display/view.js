define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

], function (

  _
  ,Lateralus

  ,template

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var UserDisplayComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      /**
       * @param {Object} userData
       */
      userLoggedIn: function (userData) {
        this.$('.user-name-display').text(userData.name);
      }
    }

    ,provide: {
    }

    ,events: {
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }
  });

  return UserDisplayComponentView;
});
