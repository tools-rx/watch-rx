
import Jasmine from 'jasmine'
import Reporter from 'jasmine-spec-reporter'

let jasmine = new Jasmine()
jasmine.loadConfigFile('tests/jasmine.json')
jasmine.addReporter(new Reporter({
  isVerbose: false,
  showColors: true,
  includeStackTrace: false
}))
jasmine.onComplete(function (passed) {
  if (passed) {
    console.log('All tests passed.')
  } else {
    console.log('Test(s) failed.')
    process.exit(1)
  }
})
jasmine.execute()
