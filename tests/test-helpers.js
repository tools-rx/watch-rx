/* eslint-env jasmine */

import _ from 'lodash'

export function getSubscriber (done) {
  return {
    next () { },
    error (err) { done.fail(err) },
    complete () { done() }
  }
}

export function sortedFileList (fileList) {
  return _.sortBy(fileList, (fn) => fn)
}
