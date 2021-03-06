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

  var UserPanelComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      userLoggedIn: function () {
        this.$loggedOut.addClass('hide');
        this.$loggedIn.removeClass('hide');
      }

      ,userRequestShowLoginPanel: function () {
        this.$userLogin.removeClass('hide');
        this.$userCreation.addClass('hide');
      }

      ,userRequestShowCreateUserPanel: function () {
        this.$userLogin.addClass('hide');
        this.$userCreation.removeClass('hide');
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

  return UserPanelComponentView;
});
