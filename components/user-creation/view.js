define([

  'underscore'
  ,'lateralus'

  ,'text!./template.mustache'

  ,'aenima.constant'

], function (

  _
  ,Lateralus

  ,template

  ,aenimaConstant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var INVALID_CLASS = aenimaConstant.INVALID_CLASS;

  var UserCreationComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
    }

    ,provide: {
      /**
       * @return {string|undefined}
       */
      enteredPassword: function () {
        return this.$passwordInput.val() || undefined;
      }
    }

    ,events: {
      /**
       * @param {jQuery.Event} evt.
       */
      'submit form': function (evt) {
        evt.preventDefault();
      }

      ,'click .create': function () {
        this.validate();

        if (this.$form[0].checkValidity()) {
          this.createUser();
        }
      }

      ,'blur input': function (evt) {
        this.validateEl(evt.target);
      }

      ,'blur .name-input': function () {
        var $nameInput = this.$nameInput;

        if ($nameInput[0].checkValidity()) {
          this.checkIfUserExists($nameInput.val());
        }
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,createUser: function () {
      var name = this.$nameInput.val();
      var email = this.$emailInput.val();
      var password = this.$passwordInput.val();

      this.checkIfUserExists(name).then(function (res) {
        if (res.doesUserExist) {
          return;
        }

        this.lateralus.dataAdapter
          .createUser({
            name: name
            ,email: email
            ,password: password
          })
          .done(
            this.onCreateUser.bind(this)
          );
      }.bind(this));
    }

    /**
     * @param {string} name
     * @return {jqXHR}
     */
    ,checkIfUserExists: function (name) {
      return this.lateralus.dataAdapter.doesUserExist(name)
        .then(function (res) {
          if (res.doesExist) {
            this.showUserCreationError(
              'Oh no! "' + name + '" already exists.  Try another user name!'
            );
          } else {
            this.$userCreationError.addClass('hide');
          }

          return res;
        }.bind(this));
    }

    /**
     * @param {string} errorMessage
     */
    ,showUserCreationError: function (errorMessage) {
      this.$userCreationError
        .text(errorMessage)
        .removeClass('hide');
    }

    ,validate: function () {
      this.$('input').each(function (i, el) {
        this.validateEl(el);
      }.bind(this));
    }

    /**
     * @param {Element} el
     */
    ,validateEl: function (el) {
      var classList = el.parentElement.classList;

      if (el.checkValidity()) {
        classList.remove(INVALID_CLASS);
      } else {
        classList.add(INVALID_CLASS);
      }
    }

    /**
     * @param {Object} userData
     */
    ,onCreateUser: function (userData) {
      this.emit('userCreated', _.pick(userData, 'id', 'name'));
    }
  });

  return UserCreationComponentView;
});
