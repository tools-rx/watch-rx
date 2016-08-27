/* eslint-env jasmine */

import path from 'path'
import fs from 'fs'
import {Observable} from 'rxjs'
import {watchRx} from '../src/watch-rx'
import {buildFileSet} from 'test-files-rx'
import {getSubscriber, sortedFileList} from './test-helpers'

const writeFileRx = Observable.bindNodeCallback(fs.writeFile)

const waitTime = 1000

export const fileSet = {
  localFiles: [
    'a/b/one',
    'a/b/two',
    'a/c/three'
  ],
  rootPath: '/tmp/watch-test',
  localPath: path.join(__dirname, '..', 'watch-test')
}

function localFileName (name) {
  return path.join(fileSet.localPath, name)
}

describe('watch-rx', () => {
  describe('with initial files', () => {
    beforeEach((done) => {
      buildFileSet(fileSet).subscribe(getSubscriber(done))
    })

    it('should return expected list of files', (done) => {
      let expected = [
        'addDir~a',
        'addDir~a/b',
        'addDir~a/c',
        'add~a/c/three',
        'add~a/b/one',
        'add~a/b/two'
      ]
      watchRx('**/*', { cwd: fileSet.localPath })
        .takeUntil(Observable.timer(waitTime))
        .reduce((names, globFile) => {
          names.push(`${globFile.event}~${globFile.name}`)
          return names
        }, [])
        .do((actual) => {
          expect(sortedFileList(actual)).toEqual(sortedFileList(expected))
        })
        .subscribe(getSubscriber(done))
    })

    it('should report file changes', (done) => {
      let expected = [
        'change~a/b/two'
      ]
      Observable
        .merge(
          watchRx('**/*', { cwd: fileSet.localPath, ignoreInitial: true }),
          Observable
            .timer(500)
            .concat(writeFileRx(localFileName('a/b/two'), 'test'))
            .ignoreElements()
        )
        .takeUntil(Observable.timer(waitTime))
        .reduce((names, globFile) => {
          names.push(`${globFile.event}~${globFile.name}`)
          return names
        }, [])
        .do((actual) => {
          expect(sortedFileList(actual)).toEqual(sortedFileList(expected))
        })
        .subscribe(getSubscriber(done))
    })
  })
})
