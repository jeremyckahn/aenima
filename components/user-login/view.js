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

  var UserLoginComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt.
       */
      'submit form': function (evt) {
        evt.preventDefault();
      }

      ,'click .create': function () {
        this.emit('userRequestShowCreateUserPanel');
      }

      ,'click .log-in': function () {
        this.logIn();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,logIn: function () {
      var name = this.$nameInput.val();
      var password = this.$passwordInput.val();

      this.lateralus.logIn(name, password)
        .then(function (data) {
          if (data.errorMessage) {
            return this.showError(data.errorMessage);
          }
        }.bind(this));
    }

    /**
     * @param {string} errorMessage
     */
    ,showError: function (errorMessage) {
      this.$userLoginError
        .text(errorMessage)
        .removeClass('hide');
    }
  });

  return UserLoginComponentView;
});
