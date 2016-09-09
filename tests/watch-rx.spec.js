/* eslint-env jasmine */

import path from 'path'
import fs from 'fs'
import {Observable} from 'rxjs'
import {watchRx} from '../src/watch-rx'
import {buildFileSet} from 'test-files-rx'
import {getSubscriber, sortedFileList} from './test-helpers'

const writeFileRx = Observable.bindNodeCallback(fs.writeFile)
const renameRx = Observable.bindNodeCallback(fs.rename)
const unlinkRx = Observable.bindNodeCallback(fs.unlink)

const observeMaxTime = 1000
const operationDelayTime = 750

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

function buildEventList (names, globFile) {
  names.push(`${globFile.event}~${globFile.name}`)
  return names
}

function compareEventLists (expected) {
  return (actual) => {
    expect(sortedFileList(actual)).toEqual(sortedFileList(expected))
  }
}

function performOperations (...operations) {
  return Observable
    .timer(operationDelayTime)
    .concat(...operations)
    .ignoreElements()
}

describe('watch-rx', () => {
  describe('with initial files', () => {
    beforeEach((done) => {
      buildFileSet(fileSet).subscribe(getSubscriber(done))
    })

    beforeEach((done) => {
      setTimeout(done, 1000)
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
        .takeUntil(Observable.timer(observeMaxTime))
        .reduce(buildEventList, [])
        .do(compareEventLists(expected))
        .subscribe(getSubscriber(done))
    })

    it('should report single file change', (done) => {
      let expected = [
        'change~a/b/two'
      ]
      Observable
        .merge(
          watchRx('**/*', { cwd: fileSet.localPath, ignoreInitial: true }),
          performOperations(
            writeFileRx(localFileName('a/b/two'), 'test')
          )
        )
        .takeUntil(Observable.timer(observeMaxTime))
        .reduce(buildEventList, [])
        .do(compareEventLists(expected))
        .subscribe(getSubscriber(done))
    })

    it('should report multiple file change', (done) => {
      let expected = [
        'change~a/b/two',
        'change~a/c/three'
      ]
      Observable
        .merge(
          watchRx('**/*', { cwd: fileSet.localPath, ignoreInitial: true }),
          performOperations(
            writeFileRx(localFileName('a/b/two'), 'test'),
            writeFileRx(localFileName('a/c/three'), 'test')
          )
        )
        .takeUntil(Observable.timer(observeMaxTime))
        .reduce(buildEventList, [])
        .do(compareEventLists(expected))
        .subscribe(getSubscriber(done))
    })

    it('should report file unlink', (done) => {
      let expected = [
        'unlink~a/b/two',
        'unlink~a/c/three'
      ]
      Observable
        .merge(
          watchRx('**/*', { cwd: fileSet.localPath, ignoreInitial: true }),
          performOperations(
            unlinkRx(localFileName('a/b/two')),
            unlinkRx(localFileName('a/c/three'))
          )
        )
        .takeUntil(Observable.timer(observeMaxTime))
        .reduce(buildEventList, [])
        .do(compareEventLists(expected))
        .subscribe(getSubscriber(done))
    })

    it('should report file add', (done) => {
      let expected = [
        'add~a/b/four',
        'add~a/c/five'
      ]
      Observable
        .merge(
          watchRx('**/*', { cwd: fileSet.localPath, ignoreInitial: true }),
          performOperations(
            writeFileRx(localFileName('a/b/four'), 'test'),
            writeFileRx(localFileName('a/c/five'), 'test')
          )
        )
        .takeUntil(Observable.timer(observeMaxTime))
        .reduce(buildEventList, [])
        .do(compareEventLists(expected))
        .subscribe(getSubscriber(done))
    })

    it('should report file rename', (done) => {
      let expected = [
        'unlink~a/b/one',
        'unlink~a/c/three',
        'add~a/b/one-renamed',
        'add~a/c/three-renamed'
      ]
      Observable
        .merge(
          watchRx('**/*', { cwd: fileSet.localPath, ignoreInitial: true }),
          performOperations(
            renameRx(localFileName('a/b/one'), localFileName('a/b/one-renamed')),
            renameRx(localFileName('a/c/three'), localFileName('a/c/three-renamed'))
          )
        )
        .takeUntil(Observable.timer(observeMaxTime))
        .reduce(buildEventList, [])
        .do(compareEventLists(expected))
        .subscribe(getSubscriber(done))
    })
  })
})
