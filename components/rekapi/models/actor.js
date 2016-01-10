define([

  'underscore'
  ,'backbone'
  ,'lateralus'
  ,'rekapi'

  ,'../collections/keyframe-property'

  ,'aenima.constant'
  ,'aenima.utils'

], function (

  _
  ,Backbone
  ,Lateralus
  ,Rekapi

  ,KeyframePropertyCollection

  ,constant
  ,utils

) {
  'use strict';

  var Base = Lateralus.Component.Model;

  var ActorModel = Base.extend({
    KeyframePropertyCollection: KeyframePropertyCollection

    /**
     * @param {Object} attributes
     * @param {Object} options
     *   @param {RekapiComponent} rekapiComponent
     *   @param {RekapiActor} actor
     */
    ,initialize: function (attributes, options) {
      this.rekapiComponent = options.rekapiComponent;
      this.actor = options.actor;

      this.transformPropertyCollection =
        this.initCollection(this.KeyframePropertyCollection);

      this.listenTo(
        this.transformPropertyCollection
        ,'change add remove'
        ,this.onMutateTransformPropertyCollection.bind(this)
      );
    }

    ,onMutateTransformPropertyCollection: function () {
      this.trigger('change');
    }

    ,removeAllKeyframes: function () {
      var transformPropertyCollection = this.transformPropertyCollection;

      // Prevent the internal Backbone.Collection operations from happening
      // while models are being removed.
      var safeCopy = transformPropertyCollection.models.slice();

      transformPropertyCollection.remove(safeCopy, { dispose: true });
    }

    /**
     * @override
     */
    ,toJSON: function () {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

      json.transformPropertyCollection =
        this.transformPropertyCollection.toJSON();

      return json;
    }

    /**
     * @param {*} context
     */
    ,setContext: function (context) {
      this.actor.context = context;
    }
  });

  utils.proxy(Rekapi.Actor, ActorModel, {
    subject: function () {
      return this.actor;
    }
  });

  return ActorModel;
});
