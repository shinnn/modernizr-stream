# modernizr-stream

[![npm version](https://img.shields.io/npm/v/modernizr-stream.svg)](https://www.npmjs.com/package/modernizr-stream)
[![Build Status](https://travis-ci.org/shinnn/modernizr-stream.svg?branch=master)](https://travis-ci.org/shinnn/modernizr-stream)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/modernizr-stream.svg)](https://coveralls.io/github/shinnn/modernizr-stream?branch=master)

Create a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) that emits [Modernizr](https://modernizr.com/) code

```javascript
const modernizrStream = require('modernizr-stream');

modernizrStream().pipe(process.stdout);
/*!
 * modernizr v3.5.0
 * Build https://modernizr.com/download?--dontmin
 ...
*/
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install modernizr-stream
```

## API

```javascript
const modernizrStream = require('modernizr-stream');
```

### modernizrStream([*options*])

*options*: `Object`  
Return: [`stream.Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable_1)

It returns a readable stream that emits JavaScript code built with the [Modernizr code generator](https://www.npmjs.com/package/modernizr#building).

#### Options

All options of [`modernizr.build`](https://github.com/Modernizr/Modernizr#building) and [`stream.Readable`](https://nodejs.org/api/stream.html#stream_new_stream_readable_options) are avilable. Note that `encoding` option defaults to `utf8`, that means the stream emits strings instead of [buffers](https://nodejs.org/api/buffer.html) by default.

```javascript
modernizrStream().on('data', data => {
  data.length; //=> 5497
});

modernizrStream({minify: true}).on('data', data => {
  data.length; //=> 1165
});
```

### modernizrStream.ctor([*options*])

*options*: `Object`  
Return: `Function` ([`stream.Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable) constructor)

Instead of creating a stream, it generates a reusable stream constructor that helps performance improvement when you create multiple streams with the same option.

```javascript
const createModernizrStream = modernizrStream.ctor({
  options: [
    'addTest',
    'mq'
  ]
});

const stream = createModernizrStream();
const stream2 = createModernizrStream();
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
