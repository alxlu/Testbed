var expect = require('chai').expect;
var SITE_LOAD_TIMEOUT = 30000;

var deleteTest = function() {
  var urlCount;
  before(function(done) {
    this.client
    .url('http://localhost:8000')
    .waitForExist('body', SITE_LOAD_TIMEOUT)
    .pause(300)
    .elements('.list-group-item')
    .then(function(elements) {
      urlCount = elements.value.length;
    })
    .call(done);
  });

  var deleteLink = function(idx) {
    return function(done) {
      this.client
      .click('a.text-warning')
      .pause(500)
      .elements('.list-group-item')
      .then(function(elements) {
        expect(elements.value.length).to.equal(urlCount - idx);
      })
      .call(done);
    }
  };

  var idx = 0;

  it('should be able to delete the first site', deleteLink.bind(this)(++idx));

  it('should be able to delete the second site', deleteLink.bind(this)(++idx));

  it('should be able to delete the third site', deleteLink.bind(this)(++idx));

  it('should have no sites remaining', function(done) {
    this.client
    .pause(500)
    .elements('.list-group-item')
    .then(function(element) {
      expect(element.value).to.be.empty;
    })
    .call(done);
  });

  it('should have no sites remaining after page reload', function(done) {
    this.client
    .url('http://localhost:8000')
    .refresh()
    .waitForExist('body', SITE_LOAD_TIMEOUT)
    .pause(500)
    .elements('.list-group-item')
    .then(function(element) {
      expect(element.value).to.be.empty;
    })
    .call(done);
  });

};

module.exports = deleteTest;
