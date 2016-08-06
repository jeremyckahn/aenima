define([

  'jquery'

], function (

  $

) {
  'use strict';

  /**
   * @param {Object} options
   * @param {string} options.apiRoot
   */
  function DataAdapter (options) {
    this.apiRoot = options.apiRoot;
  }

  DataAdapter.prototype = {
    /**
     * @param {string} api
     * @param {Object} [data]
     * @return {jqXHR}
     */
    post: function (api, data) {
      return $.ajax(`${this.apiRoot}/${api}`, { method: 'POST' , data });
    }

    /**
     * @param {string} name
     * @return {jqXHR}
     */
    ,doesUserExist: function (name) {
      return this.post('user/does-exist', { name });
    }

    /**
     * @param {Object} options
     * @param {string} options.name
     * @param {string} options.email
     * @param {string} options.password
     * @return {jqXHR}
     */
    ,createUser: function (options) {
      return this.post('user/create', options);
    }

    /**
     * @param {Object} options
     * @param {string} options.name
     * @param {string} options.password
     * @return {jqXHR}
     */
    ,login: function (options) {
      return this.post('user/login', options);
    }
  };

  return DataAdapter;
});
