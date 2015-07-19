var expect = require('chai').expect;
var SITE_LOAD_TIMEOUT = 30000;

var navigateTest = function() {
  it('loads the site', function(done) {
    this.client
    .url('http://localhost:8000')
    .waitForExist('body', SITE_LOAD_TIMEOUT)
    .getTitle().then(function(title) {
      expect(title).to.equal('Windows 10 Testbed');
    })
    .call(done);
  });

  it('navigates to ContosoTravel using the Go button', function(done) {
    this.client
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
    this.client
    .back()
    .pause(300)
    .waitForExist('body', SITE_LOAD_TIMEOUT)
    .pause(2000)
    .call(done);
  });

  it ('navigates to RJS page using enter key', function(done) {
    this.client
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
    this.client
    .back()
    .pause(300)
    .waitForExist('body', SITE_LOAD_TIMEOUT)
    .pause(2000)
    .call(done);
  });

  it ('navigates to bing', function(done) {
    this.client
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
};

module.exports = navigateTest;
