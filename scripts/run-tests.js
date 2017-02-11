
import Jasmine from 'jasmine'
import {SpecReporter} from 'jasmine-spec-reporter'

let jasmine = new Jasmine()
jasmine.loadConfigFile('tests/jasmine.json')
jasmine.addReporter(new SpecReporter())
jasmine.onComplete(function (passed) {
  if (passed) {
    console.log('All tests passed.')
  } else {
    console.log('Test(s) failed.')
    process.exit(1)
  }
})
jasmine.execute()
