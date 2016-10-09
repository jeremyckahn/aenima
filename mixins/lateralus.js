define([

], function (

) {
  'use strict';

  return {
    lateralusEvents: {
      /**
       * @param {Object} userData
       */
      userCreated: function (userData) {
        this.login(
          userData.name
          ,this.collectOne('enteredPassword')
        );
      }
    }

    ,fn: {
      /**
       * @param {string} name
       * @param {string} password
       * @return {jqXHR}
       */
      login: function (name, password) {
        this.dataAdapter
          .login({ name: name, password: password })
          .then(function (user) {
            this.emit('userLoggedIn', user);
          }.bind(this));
      }
    }
  };
});
