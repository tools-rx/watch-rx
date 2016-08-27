# watch-rx

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

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
