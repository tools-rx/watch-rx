/* eslint-env jasmine */

import {GlobResultFile} from '../src/glob-result-file'

describe('glob result file', () => {
  describe('with defaults', () => {
    let globResult

    beforeEach(() => {
      globResult = new GlobResultFile()
    })

    it('should have no name', () => {
      expect(globResult.hasName).toBe(false)
    })

    it('should have undefined fullname', () => {
      expect(globResult.fullname).toBeUndefined()
    })

    it('should have undefined basename', () => {
      expect(globResult.basename).toBeUndefined()
    })

    it('should have undefined dirname', () => {
      expect(globResult.dirname).toBeUndefined()
    })

    it('should have undefined extname', () => {
      expect(globResult.extname).toBeUndefined()
    })
  })

  describe('with basedir and path', () => {
    let globResult

    beforeEach(() => {
      globResult = Object.assign(new GlobResultFile(), {
        basedir: '/tmp/glob-files',
        name: 'a/b/c/file.txt'
      })
    })

    it('should have name', () => {
      expect(globResult.hasName).toBe(true)
    })

    it('should have fullname', () => {
      expect(normalizeSeparators(globResult.fullname)).toBe('/tmp/glob-files/a/b/c/file.txt')
    })

    it('should have basename', () => {
      expect(globResult.basename).toBe('file.txt')
    })

    it('should have dirname', () => {
      expect(normalizeSeparators(globResult.dirname)).toBe('/tmp/glob-files/a/b/c')
    })

    it('should have extname', () => {
      expect(globResult.extname).toBe('.txt')
    })

    function normalizeSeparators (path) {
      return path ? path.replace(/\\/g, '/') : path
    }
  })
})
