define([

  'underscore'
  ,'lateralus'
  ,'keydrown'

  ,'aenima.utils'

], function (

  _
  ,Lateralus
  ,kd

  ,aenimaUtils

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

      this.bindEventMapToKeyEvents(
        'press'
        ,this.metaKeyPressEventMap
        ,[aenimaUtils.isMac() ? 'metaKey' : 'ctrlKey']
      );
    }

    // To be overridden by subclasses
    ,keyPressEventMap: {}

    // To be overridden by subclasses
    ,metaKeyPressEventMap: {}

    // To be overridden by subclasses
    ,keyUpEventMap: {}

    /**
     * @param {string} keyEventName
     * @param {Object.<string>} map
     * @param {Array.<string>?} opt_modifierKeys
     */
    ,bindEventMapToKeyEvents: function (keyEventName, map, opt_modifierKeys) {
      _.each(map, function (eventNames, keyName) {
        kd[keyName][keyEventName](
          this.requestEvent.bind(this, eventNames, opt_modifierKeys || []));
      }, this);
    }

    /**
     * @param {string|Array.<string>} eventNames
     * @param {Array.<string>} modifierKeys
     * @param {KeyboardEvent} evt
     */
    ,requestEvent: function (eventNames, modifierKeys, evt) {
      var activeNodeName = document.activeElement.nodeName.toLowerCase();

      // If user is focused on an input
      if (_.contains(INPUT_ELEMENTS, activeNodeName) || (

            // Or if a modifier key is required and not held
            modifierKeys.length &&
            !_.every(_.pick.apply(_, [evt].concat(modifierKeys))))
          ) {
        return;
      }

      eventNames = _.isArray(eventNames) ? eventNames : [eventNames];

      eventNames.forEach(function (eventName) {
        this.emit(eventName, evt);
      }.bind(this));
    }
  });

  return KeybindingsComponent;
});
