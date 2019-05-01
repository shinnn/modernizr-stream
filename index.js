'use strict';

const {Readable} = require('stream');

const {build} = require('modernizr');
const inspectWithKind = require('inspect-with-kind');
const isPlainObject = require('lodash/isPlainObject');
const jsonStableStringifyWithoutJsonify = require('json-stable-stringify-without-jsonify');

const built = Symbol('built');
const read = Symbol('read');
const caches = new Map();

class ModernizrStream extends Readable {
	#fullModernizrCode = null;
	#emittedLength = 0;

	constructor(...args) {
		const argLen = args.length;
		const [options = {}] = args;

		if (argLen === 1) {
			if (!isPlainObject(options)) {
				const error = new TypeError(`Expected an <Object> to set modernizr-stream options, but got ${
					inspectWithKind(options)
				}.`);

				error.code = 'ERR_INVALID_ARG_TYPE';
				throw error;
			}
		} else if (argLen !== 0) {
			const error = new RangeError(`Expected 0 or 1 argument (<Object>), but got ${argLen} arguments.`);

			error.code = 'ERR_TOO_MANY_ARGS';
			throw error;
		}

		super(options);

		const cacheKey = jsonStableStringifyWithoutJsonify(options);
		const cache = caches.get(cacheKey);

		if (cache !== undefined) {
			this.#fullModernizrCode = cache;
			this.emit(built);

			return;
		}

		build(options, code => {
			const codeUint8Array = new TextEncoder().encode(code);

			caches.set(cacheKey, codeUint8Array);
			this.#fullModernizrCode = codeUint8Array;
			this.emit(built);
		});
	}

	// Replaceable with a private method `#read()` in the future
	// https://github.com/tc39/proposal-private-methods
	[read](size) {
		const sliced = this.#fullModernizrCode.slice(this.#emittedLength, this.#emittedLength + size);

		this.#emittedLength += sliced.length;
		this.push(sliced);

		if (this.#fullModernizrCode.length === this.#emittedLength) {
			this.push(null);
		}
	}

	_read(size) {
		if (this.#fullModernizrCode === null) {
			this.once(built, () => this[read](size));
			return;
		}

		this[read](size);
	}
}

module.exports = function modernizrStream(...args) {
	return new ModernizrStream(...args);
};
