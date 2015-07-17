var expect = require('chai').expect;
var webdriverio = require('webdriverio');

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');

var exec = require('child_process').exec;

var gulppath = path.join(require.resolve('gulp'), '../bin/gulp.js');

var SITE_LOAD_TIMEOUT = 30000;

exec('node ' + gulppath + ' build', function() {
  connect().use(serveStatic(path.join(__dirname, '../dist'))).listen(8080);
  run();
});

describe('Win 10 Testbed E2E', function() {
  this.timeout(99999999);
  var client = {};

  before(function(done) {
    client = webdriverio.remote({desiredCapabilities: {browserName: 'chrome'} });
    client.init(done);
  });

  describe('navigating to sites', function() {
    it('loads the site', function(done) {
      client
      .url('http://localhost:8080')
      .waitForExist('body', SITE_LOAD_TIMEOUT)
      .getTitle().then(function(title) {
        expect(title).to.equal('Windows 10 Testbed');
      })
      .call(done);
    });

    it('navigates to ContosoTravel using the Go button', function(done) {
      client
      .click('#server-address-input')
      .keys('https://contosotravel.azurewebsites.net')
      .click('#submit-address')
      .waitUntil(function() {
        return this.getTitle().then(function(title) {
          return title && title.indexOf && title.indexOf('contoso') > -1;
        });
      }, SITE_LOAD_TIMEOUT)
      .url(function(err, res) {
        expect(res.value).to.equal('https://contosotravel.azurewebsites.net/');
      })
      .call(done);
    });

    it('navigates back to the testbed and saves the previously visited url(s)', function(done) {
      client
      .back()
      .pause(300)
      .waitForExist('body', SITE_LOAD_TIMEOUT)
      .pause(2000)
      .call(done);
    });

    it ('navigates to RJS page using enter key', function(done) {
      client
        .click('#server-address-input')
        .keys('https://rjs.azurewebsites.net')
        .keys('Enter')
        .waitUntil(function() {
          return this.getTitle().then(function(title) {
            return title && title.indexOf && title.indexOf('rjs') > -1;
          });
        }, SITE_LOAD_TIMEOUT)
        .url(function(err, res) {
          expect(res.value).to.equal('https://rjs.azurewebsites.net/');
        })
        .call(done);
    });

    it('navigates back to the testbed and saves the previously visited url(s)', function(done) {
      client
      .back()
      .pause(300)
      .waitForExist('body', SITE_LOAD_TIMEOUT)
      .pause(2000)
      .call(done);
    });

    it ('navigates to bing', function(done) {
      client
      .click('#server-address-input')
      .keys('http://bing.com')
      .click('#submit-address')
      .waitUntil(function() {
        return this.getTitle().then(function(title) {
          return (title && title.indexOf) && title.indexOf('ing') > -1;
        });
      }, SITE_LOAD_TIMEOUT)
      .url(function(err, res) {
        expect(res.value).to.contain('bing');
      })
      .call(done);
    });
  });

  describe('checking added sites', function() {
    it ('keeps the list of sites stored', function(done) {
      client
      .url('http://localhost:8080')
      .pause(3000)
      .call(done);
    });
  });

  describe('removing sites', function() {
  });

  after(function(done) {
    client.end(done);
  });

});
