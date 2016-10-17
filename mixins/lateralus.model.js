define([

  'underscore'

], function (

  _

) {
  'use strict';

  return {
    fn: {
      postInitialize: function () {
        this.set('user', _.clone(this.attributes.env.user) || {
          isTempUser: true
        });
      }

      /**
       * @return {boolean}
       */
      ,isLoggedIn: function () {
        return !this.get('user').isTempUser;
      }
    }
  };
});
