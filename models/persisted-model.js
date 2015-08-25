
define([

  'underscore'
  ,'lateralus'

  ,'aenima.mixin/local-storage-model'

], function (

  _
  ,Lateralus

  ,localStorageMixin

) {
  'use strict';

  var PersistedModel = Lateralus.Model.extend({
    // Subclasses should override this with a unique ID!
    localStorageId: 'persistedModelData'

    ,initialize: function () {
      // TODO: It would be nice if the localStorageMixin methods were mixed in
      // directly onto PersistedModel's prototype.
      this.mixin(localStorageMixin);
    }

    /**
     * @param {string} name
     * @return {*}
     */
    ,getUi: function (name) {
      return this.get('ui')[name];
    }

    /**
     * @param {string} name
     * @param {*} value
     */
    ,setUi: function (name, value) {
      this.attributes.ui[name] = value;

      // Persist app state to localStorage.
      this.trigger('change');
    }
  });

  return PersistedModel;
});
