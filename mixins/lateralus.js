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
      postInitialize: function () {
        if (this.model.isLoggedIn()) {
          this.emit('userLoggedIn', this.model.get('user'));
        }
      }

      /**
       * @param {string} name
       * @param {string} password
       * @return {jqXHR}
       */
      ,logIn: function (name, password) {
        return this.dataAdapter
          .logIn({ name: name, password: password })
          .then(function (data) {
            if (data.errorMessage) {
              return data;
            }

            this.model.set('user', data);
            this.emit('userLoggedIn', data);

            return data;
          }.bind(this));
      }
    }
  };
});
