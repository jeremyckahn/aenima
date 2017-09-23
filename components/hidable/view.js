define([

  'underscore'
  ,'lateralus'

  ,'rekapi'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,rekapi

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;
  const { Rekapi } = rekapi;

  var HidableComponentView = Base.extend({
    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     * @param {boolean=} [options.startHidden]
     * @param {number=} [options.targetShowOpacity]
     */
    initialize: function (options) {
      baseProto.initialize.apply(this, arguments);
      this.isHidden = !!options.startHidden;
      this.targetShowOpacity = options.targetShowOpacity || 1;

      if (this.isHidden) {
        this.hideCallback();
      }

      this.actor = (new Rekapi(this.el)).addActor({
        context: this.el
      });
    }

    /**
     * @param {Function} keyframeFn
     * @param {Function(Rekapi.Actor)} callback
     */
    ,_hide: function (keyframeFn, callback) {
      if (this.isHidden || this.actor.rekapi.isPlaying()) {
        return;
      }

      this.actor.removeAllKeyframes();
      keyframeFn(this.actor);

      var onStop = function () {
        callback();
        this.hideCallback();
        this.actor.rekapi.off('stop', onStop);
      }.bind(this);

      this.actor.rekapi
        .on('stop', onStop)
        .play(1);
    }

    /**
     * @param {Function(Rekapi.Actor)} callback
     */
    ,_show: function (keyframeFn) {
      if (!this.isHidden || this.actor.rekapi.isPlaying()) {
        return;
      }

      this.$el.css('display', '');

      this.actor.removeAllKeyframes();
      keyframeFn(this.actor);

      var onStop = function () {
        this.isHidden = false;
        this.actor.rekapi.off('stop', onStop);
      }.bind(this);

      this.actor.rekapi
        .on('stop', onStop)
        .play(1);
    }

    /**
     * @param {Function} [callback]
     */
    ,hide: function (callback) {
      return this._hide(
        function (actor) {
          actor
            .keyframe(0, {
              scale: 1
              ,opacity: this.targetShowOpacity
            }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
              scale: 0
              ,opacity: 0
            }, {
              scale: 'easeInBack'
              ,opacity: 'easeOutQuad'
            });
        }.bind(this),
        callback || _.noop
      );
    }

    /**
     * @param {Function} [callback]
     */
    ,quickHide: function (callback) {
      return this._hide(
        function (actor) {
          actor
            .keyframe(0, {
              scale: 1
              ,opacity: this.targetShowOpacity
            }).keyframe(constant.HIDABLE_VIEW_TRANSITION_QUICK_DURATION, {
              scale: 0
              ,opacity: 0
            }, {
              scale: 'easeOutQuad'
              ,opacity: 'easeOutQuad'
            });
        }.bind(this),
        callback || _.noop
      );
    }

    ,show: function () {
      return this._show(
        function (actor) {
          actor
            .keyframe(0, {
              scale: 0
              ,opacity: 0
            }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
              scale: 1
              ,opacity: this.targetShowOpacity
            }, {
              scale: 'swingTo'
              ,opacity: 'easeInQuad'
            });
        }.bind(this)
      );
    }

    ,quickShow: function () {
      return this._show(
        function (actor) {
          actor
            .keyframe(0, {
              scale: 0
              ,opacity: 0
            }).keyframe(constant.HIDABLE_VIEW_TRANSITION_QUICK_DURATION, {
              scale: 1
              ,opacity: this.targetShowOpacity
            }, {
              scale: 'easeInQuad'
              ,opacity: 'easeInQuad'
            });
        }.bind(this)
      );
    }

    ,quickFadeIn: function () {
      this.$el.css({
        transform: 'scale(1)'
        ,opacity: 0
      });

      return this._show(
        function (actor) {
          actor
            .keyframe(0, {
              opacity: 0
            }).keyframe(constant.HIDABLE_VIEW_TRANSITION_QUICK_DURATION, {
              opacity: this.targetShowOpacity
            }, {
              opacity: 'easeInQuad'
            });
        }.bind(this)
      );
    }

    ,hideCallback: function () {
      this.$el.css('display', 'none');
      this.isHidden = true;
    }

    ,toggle: function () {
      this[this.isHidden ? 'show' : 'hide']();
    }
  });

  return HidableComponentView;
});
