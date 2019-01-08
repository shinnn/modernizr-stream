'use strict';

const from2 = require('from2');
const modernizr = require('modernizr');
const SafeBuffer = require('safe-buffer').Buffer;

const inspectWithKind = require('inspect-with-kind');
const isPlainObject = require('lodash/isPlainObject');
const jsonStableStringifyWithoutJsonify = require('json-stable-stringify-without-jsonify');
const zeroLengthBuffer = SafeBuffer.alloc(0);
const caches = new Map();

const ctor = function modernizrStreamCtor(options = {}) {
	const ctor = from2.ctor({encoding: 'utf8', ...options}, function readModernizrCode(size, next) {
		if (ctor.modernizrCode === null) {
			setImmediate(() => next(null, zeroLengthBuffer));
			return;
		}

		if (!isPlainObject(options)) {
			const error = new TypeError(`Expected an <Object> to set modernizr-stream options, but got ${
				inspectWithKind(options)
			}.`);

			error.code = 'ERR_INVALID_ARG_TYPE';
			throw error;
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

	const cacheKey = jsonStableStringifyWithoutJsonify(options);
	const cache = caches.get(cacheKey);

	if (cache !== undefined) {
		ctor.modernizrCode = cache;
	} else {
		modernizr.build(options, result => {
			ctor.modernizrCode = result;
			caches.set(cacheKey, result);
		});
	}

	return ctor;
};

module.exports = function modernizrStream(options) {
	return new (ctor(options))();
};
