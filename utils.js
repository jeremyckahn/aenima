define([

  'underscore'

], function (

  _

) {
  'use strict';

  var queryParams = (function () {
    var queryString = location.search.slice(1);
    var stringChunks = queryString.split('&');

    var accumulator = {};
    stringChunks.forEach(function (stringChunk) {
      var pair = stringChunk.split('=');
      accumulator[pair[0]] = pair[1];
    });

    return accumulator;
  })();

  return  {
    /**
     * @param {Function} Source A constructor from which to steal prototype
     * methods.
     * @param {Function} Target A constructor whose instances Source's methods
     * should be .apply-ed to.
     * @param {Object} opts
     * @param {Array.<string>} [opts.blacklistedMethodNames] A list of method
     * names that should not be copied over from Source.prototype.
     * @param {function} [opts.subject] A function that returns the Object that
     * Source's methods should be applied to.
     */
    proxy: function (Source, Target, opts) {
      opts = opts || {};
      var blacklistedMethodNames = opts.blacklistedMethodNames || [];
      var subject = opts.subject;

      var whitelistedMethodNames =
        _.difference(Object.keys(Source.prototype), blacklistedMethodNames);
      var definedProtoMethodNames = Object.keys(Target.prototype);
      var methodNamesToProxy =
        _.difference(whitelistedMethodNames, definedProtoMethodNames);

      var sourceProto = Source.prototype;
      var targetProto = Target.prototype;

      methodNamesToProxy.forEach(function (methodName) {
        var method = sourceProto[methodName];
        targetProto[methodName] = function () {
          var target = subject ? subject.call(this) : this;
          return method.apply(target, arguments);
        };
      }, this);
    }

    /**
     * @param {string} param
     * @return {*}
     */
    ,getQueryParam: function (param) {
      return queryParams[param];
    }
  };
});
