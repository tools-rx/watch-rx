import {Observable} from 'rxjs'
import {GlobResultFile} from './glob-result-file'
import chokidar from 'chokidar'

export function watchRx (pattern, options) {
  options = options || {}
  let basedir = options.cwd || process.cwd()

  return Observable
    .create((observer) => {
      let isFinished = false

      let watcher = chokidar.watch(pattern, options)
      let nextItem = (event) => (name) => observer.next(Object.assign(new GlobResultFile(), {
        event,
        basedir,
        name: name.replace(/\\/g, '/')
      }));

      ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(event => {
        watcher.on(event, nextItem(event))
      })

      watcher.on('error', err => {
        isFinished = true
        observer.error(err)
        closeWatcher()
      })

      return () => {
        if (!isFinished) {
          closeWatcher()
        }
      }

      // Node doesn't exit after closing watchers
      // https://github.com/paulmillr/chokidar/issues/434
      function closeWatcher () {
        watcher.close()
      }
    })
}
