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
        this.logIn(
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
      logIn: function (name, password) {
        return this.dataAdapter
          .logIn({ name: name, password: password })
          .then(function (data) {
            if (data.errorMessage) {
              return data;
            }

            this.emit('userLoggedIn', data);

            return data;
          }.bind(this));
      }
    }
  };
});
