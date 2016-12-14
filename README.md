# watch-rx

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![npm](https://img.shields.io/npm/v/watch-rx.svg?maxAge=2592000)](https://www.npmjs.com/package/watch-rx)
[![bitHound Dependencies](https://www.bithound.io/github/tools-rx/watch-rx/badges/dependencies.svg)](https://www.bithound.io/github/tools-rx/watch-rx/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/tools-rx/watch-rx/badges/devDependencies.svg)](https://www.bithound.io/github/tools-rx/watch-rx/master/dependencies/npm)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

| Linux/OSX | Windows |
| --- | --- |
| [![Build Status](https://travis-ci.org/tools-rx/watch-rx.svg?branch=master)](https://travis-ci.org/tools-rx/watch-rx) | [![Build status](https://ci.appveyor.com/api/projects/status/k1y4ynli9xkdt5c0?svg=true)](https://ci.appveyor.com/project/dfbaskin/watch-rx) |

File watcher using RxJS.  Wraps the [chokidar.watch](https://github.com/paulmillr/chokidar) function.

## Usage

Install from NPM

```
npm install --save watch-rx
```

Use it as an observable.

```javascript
var watchRx = require('watch-rx');

var subscription = watchRx(pattern, options)
    .subscribe(
        function(file) {
            // .. do something with file
            console.log(file.fullname);
        },
        function(err) {
            // ... error handling
        },
        function() {
            // ... end of files
        });

// Some time later ...
subscription.unsubscribe();
```

This module wraps the `chokidar.watch` function in an observable, so the `pattern` and `options` parameters
are the same.

## Output

The observable returns an object with three properties:

- `event` - the event that occurred, `add`, `addDir`, `change`, `unlink`, `unlinkDir`.

- `basedir` - the base directory the pattern is relative to (corresponds to the `cwd` property
in the options passed to the watch function).

- `name` - the file name relative to the `basedir` property.

The object also supports a number of calculated properties to get additional information about the file.

- `fullname` - returns the full name of the file (the `basedir` plus the `name`).

- `basename` - returns the base filename without any path.

- `dirname` - return the full path, without the file name.

- `extname` - returns the file extension.
