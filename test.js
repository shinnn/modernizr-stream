'use strict';

const acorn = require('acorn');
const modernizrStream = require('.');
const test = require('tape');

test('modernizrStream()', t => {
  t.plan(8);

  t.strictEqual(modernizrStream.name, 'modernizrStream', 'should have a function name.');

  modernizrStream().on('data', data => {
    t.doesNotThrow(() => acorn.parse(data), 'should emit valid JS code.');
    t.ok(data.includes('Modernizr'), 'should emit Modernizr code.');
  });

  const chunks = [];

  modernizrStream({
    highWaterMark: 4000,
    'feature-detects': ['test/canvas']
  })
  .on('data', data => {
    chunks.push(data);

    if (chunks.length === 1) {
      t.ok(
        data.includes('http://modernizr.com/download?-canvas-dontmin'),
        'should pass options to Modernizr build.'
      );

      t.strictEqual(
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
      () => acorn.parse(chunks.join('')),
      'should emit chunks of Modernizr code continuously.'
    );
  });

  t.throws(
    () => modernizrStream({options: [1]}),
    /TypeError/,
    'should throw a type error when it takes invalid modernizr build options.'
  );
});

test('modernizrStream.ctor()', t => {
  t.strictEqual(modernizrStream.ctor.name, 'modernizrStreamCtor', 'should have a function name.');

  t.strictEqual(
    typeof modernizrStream.ctor().prototype._read, // eslint-disable-line
    'function',
    'should create a ReadableStream constructor.'
  );

  t.end();
});
