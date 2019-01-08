'use strict';

const parseJs = require('acorn').parse;
const modernizrStream = require('.');
const test = require('tape');

test('modernizrStream()', t => {
	t.plan(6);

	modernizrStream().on('data', data => {
		t.doesNotThrow(() => parseJs(data), 'should emit valid JS code.');

		modernizrStream().on('data', anotherData => {
			t.ok(anotherData.includes('Modernizr'), 'should emit Modernizr code.');
		});
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
});

test('Argument validation', t => {
	t.throws(
		() => modernizrStream(new Int32Array()),
		/^TypeError: Expected an <Object> to set modernizr-stream options, but got Int32Array \[\]/u,
		'should fail when it takes a non-plain object argument.'
	);

	t.throws(
		() => modernizrStream({encoding: 'μtf8'}),
		/ERR_UNKNOWN_ENCODING/u,
		'should fail when it takes invalid ReadableStream constructor options.'
	);

	t.throws(
		() => modernizrStream({options: [1]}),
		/^TypeError/u,
		'should fail when it takes invalid Modernizr build options.'
	);

	t.throws(
		() => modernizrStream({}, {}),
		/^RangeError: Expected 0 or 1 argument \(<Object>\), but got 2 arguments\./u,
		'should fail when it takes too many arguments.'
	);

	t.end();
});
