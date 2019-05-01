# modernizr-stream

[![npm version](https://img.shields.io/npm/v/modernizr-stream.svg)](https://www.npmjs.com/package/modernizr-stream)
[![Build Status](https://travis-ci.com/shinnn/modernizr-stream.svg?branch=master)](https://travis-ci.com/shinnn/modernizr-stream)
[![codecov](https://codecov.io/gh/shinnn/modernizr-stream/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/modernizr-stream)

Create a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) that emits [Modernizr](https://modernizr.com/) code

```javascript
const modernizrStream = require('modernizr-stream');

modernizrStream().pipe(process.stdout);
/*!
 * modernizr v3.6.0
 * Build https://modernizr.com/download?--dontmin
 ...
*/
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

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

All options of [`modernizr.build`](https://github.com/Modernizr/Modernizr#building) and [`stream.Readable`](https://nodejs.org/api/stream.html#stream_new_stream_readable_options) are available.

```javascript
modernizrStream().on('data', data => {
  data.length; //=> 5497
});

modernizrStream({minify: true}).on('data', data => {
  data.length; //=> 1165
});
```

## License

[ISC License](./LICENSE) © 2018 - 2019 Shinnosuke Watanabe
