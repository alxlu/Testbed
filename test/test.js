var expect = require('chai').expect;
var webdriverio = require('webdriverio');

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');

var exec = require('child_process').exec;

var gulppath = path.join(require.resolve('gulp'), '../bin/gulp.js');

var SITE_LOAD_TIMEOUT = 30000;

var webdriverOpts = {
  host: 'ondemand.saucelabs.com',
  port: 80,
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  desiredCapabilities: {
    name: 'TestBed-Test',
    browserName: 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
  }
};

if (!process.env.CI) {
  webdriverOpts = {
    desiredCapabilities: {
      browserName: 'chrome'
    }
  }
}

exec('node ' + gulppath + ' build', function() {
  connect().use(serveStatic(path.join(__dirname, '../dist'))).listen(8000);
  run();
});

describe('Win 10 Testbed E2E', function() {
  this.timeout(99999999);
  this.client = {};

  before(function(done) {
    this.client = webdriverio.remote(webdriverOpts);
    this.client.init(done);
  });

  describe('navigating to sites', require('./webdriver/navigateTest').bind(this));

  describe('checking added sites', function() {
    it ('keeps the list of sites stored', function(done) {
      this.client
      .url('http://localhost:8000')
      .pause(3000)
      .call(done);
    });
  });

  describe('removing sites', function() {
  });

  after(function(done) {
    this.client.end(done);
  });

});
