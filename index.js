'use strict';

const from2 = require('from2');
const modernizr = require('modernizr');
const SafeBuffer = require('safe-buffer').Buffer;

const zeroLengthBuffer = SafeBuffer.alloc(0);

module.exports = function modernizrStream(options) {
	return new (module.exports.ctor(options))();
};

module.exports.ctor = function modernizrStreamCtor(options) {
	const ctor = from2.ctor(Object.assign({encoding: 'utf8'}, options), function readModernizrCode(size, next) {
		if (ctor.modernizrCode === null) {
			setImmediate(() => next(null, zeroLengthBuffer));
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

		const chunk = this.unreadModernizrCode.slice(0, size);
		this.unreadModernizrCode = this.unreadModernizrCode.slice(size);

		next(null, chunk);
	});

	ctor.modernizrCode = null;

	ctor.prototype.unreadModernizrCode = null;
	ctor.prototype.firstModernizrChunkEmitted = false;

	modernizr.build(options, result => {
		ctor.modernizrCode = result;
	});

	return ctor;
};
