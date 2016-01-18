/*!
 * modernizr-stream | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/modernizr-stream
*/
'use strict';

var from2 = require('from2');
var modernizr = require('modernizr');
var objectAssign = require('object-assign');

var zeroLengthBuffer = new Buffer(0);

module.exports = function modernizrStream(options) {
  return new (module.exports.ctor(options))();
};

module.exports.ctor = function modernizrStreamCtor(options) {
  var ctor = from2.ctor(objectAssign({encoding: 'utf8'}, options), function readModernizrCode(size, next) {
    if (ctor.modernizrCode === null) {
      setImmediate(function() {
        next(null, zeroLengthBuffer);
      });

      return;
    }

    if (!this.firstModernizrChunkEmitted) {
      this.unreadModernizrCode = ctor.modernizrCode;
      this.firstModernizrChunkEmitted = true;
    }

    if (this.unreadModernizrCode.length === 0) {
      next(null, null);
      return;
    }

    var chunk = this.unreadModernizrCode.slice(0, size);
    this.unreadModernizrCode = this.unreadModernizrCode.slice(size);

    next(null, chunk);
  });

  ctor.modernizrCode = null;

  ctor.prototype.unreadModernizrCode = null;
  ctor.prototype.firstModernizrChunkEmitted = false;

  modernizr.build(options, function(result) {
    ctor.modernizrCode = result;
  });

  return ctor;
};
