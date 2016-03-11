# modernizr-stream

[![NPM version](https://img.shields.io/npm/v/modernizr-stream.svg)](https://www.npmjs.com/package/modernizr-stream)
[![Build Status](https://travis-ci.org/shinnn/modernizr-stream.svg?branch=master)](https://travis-ci.org/shinnn/modernizr-stream)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/modernizr-stream.svg)](https://coveralls.io/github/shinnn/modernizr-stream?branch=master)
[![Dependency Status](https://david-dm.org/shinnn/modernizr-stream.svg)](https://david-dm.org/shinnn/modernizr-stream)
[![devDependency Status](https://david-dm.org/shinnn/modernizr-stream/dev-status.svg)](https://david-dm.org/shinnn/modernizr-stream#info=devDependencies)

Create a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) that emits [Modernizr](https://modernizr.com/) code

```javascript
const modernizrStream = require('modernizr-stream');

modernizrStream().pipe(process.stdout);
/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?--dontmin
 ...
*/
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install modernizr-stream
```

## API

```javascript
const modernizrStream = require('modernizr-stream');
```

### modernizrStream([*options*])

*options*: `Object`  
Return: `Object` ([`stream.Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable_1) instance)

It returns a readable stream that emits JavaScript code built with the  [Modernizr code generator](https://www.npmjs.com/package/modernizr#building).

#### Options

All options of [`modernizr.build`](https://github.com/Modernizr/Modernizr#building) and [`stream.Readable`](https://nodejs.org/api/stream.html#stream_new_stream_readable_options) are avilable. Note that `encoding` option defaults to `utf8`, that means the stream emits strings instead of [buffers](https://nodejs.org/api/buffer.html) by default.

```javascript
modernizrStream().on('data', data => {
  data.length; //=> 5527
});

modernizrStream({minify: true}).on('data', data => {
  data.length; //=> 1164
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

Copyright (c) 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
