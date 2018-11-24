'use strict';

const parseJs = require('acorn').parse;
const modernizrStream = require('.');
const test = require('tape');

test('modernizrStream()', t => {
	t.plan(7);

	modernizrStream().on('data', data => {
		t.doesNotThrow(() => parseJs(data), 'should emit valid JS code.');
		t.ok(data.includes('Modernizr'), 'should emit Modernizr code.');
	});

	const chunks = [];

	modernizrStream({
		highWaterMark: 4000,
		'feature-detects': ['test/canvas']
	})
	.on('error', t.fail)
	.on('data', data => {
		chunks.push(data);

		if (chunks.length === 1) {
			t.ok(
				data.includes('https://modernizr.com/download?-canvas-dontmin'),
				'should pass options to Modernizr build.'
			);

			t.equal(
				data.length,
				4000,
				'should pass options to ReadableStream constructor.'
			);

			return;
		}

		t.ok(
			data.length < 4000,
			'should not emit data more than the recommended amount of data.'
		);
	})
	.on('end', () => {
		t.doesNotThrow(
			() => parseJs(chunks.join('')),
			'should emit chunks of Modernizr code continuously.'
		);
	});

	t.throws(
		() => modernizrStream({options: [1]}),
		/TypeError/u,
		'should throw a type error when it takes invalid modernizr build options.'
	);
});

test('modernizrStream.ctor()', t => {
	t.equal(modernizrStream.ctor.name, 'modernizrStreamCtor', 'should have a function name.');

	t.equal(
    typeof modernizrStream.ctor().prototype._read, // eslint-disable-line
		'function',
		'should create a ReadableStream constructor.'
	);

	t.end();
});
