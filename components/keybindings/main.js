define([

  'underscore'
  ,'lateralus'
  ,'keydrown'

], function (

  _
  ,Lateralus
  ,kd

) {
  'use strict';

  var Base = Lateralus.Component;

  // If the user is focused on any of these types of elements, global
  // keybinding handlers are blocked.
  var INPUT_ELEMENTS = [
    'select'
    ,'input'
    ,'textarea'
  ];

  var KeybindingsComponent = Base.extend({
    name: 'aenima-keybindings'

    ,initialize: function () {
      this.bindEventMapToKeyEvents('press', this.keyPressEventMap);
      this.bindEventMapToKeyEvents('up', this.keyUpEventMap);
    }

    // To be overridden by subclasses
    ,keyPressEventMap: {}

    // To be overridden by subclasses
    ,keyUpEventMap: {}

    /**
     * @param {string} keyEventName
     * @param {Object.<string>} map
     */
    ,bindEventMapToKeyEvents: function (keyEventName, map) {
      _.each(map, function (stylieEventNames, keyName) {
        kd[keyName][keyEventName](
          this.requestEvent.bind(this, stylieEventNames));
      }, this);
    }

    /**
     * @param {string|Array.<string>} eventNames
     */
    ,requestEvent: function (eventNames) {
      var activeNodeName = document.activeElement.nodeName.toLowerCase();

      if (_.contains(INPUT_ELEMENTS, activeNodeName)) {
        return;
      }

      eventNames = _.isArray(eventNames) ? eventNames : [eventNames];

      eventNames.forEach(function (eventName) {
        this.emit(eventName);
      }.bind(this));
    }
  });

  return KeybindingsComponent;
});
