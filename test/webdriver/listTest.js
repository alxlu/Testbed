var expect = require('chai').expect;
var SITE_LOAD_TIMEOUT = 30000;
var url = require('url');

var listTest = function() {
  var urls = [
    'https://contosotravel.azurewebsites.net',
    'https://rjs.azurewebsites.net',
    'http://bing.com'
  ].sort();

  var savedUrls = [];

  before(function(done) {
    var count = 0;
    var that = this;
    this.client
    .url('http://localhost:8000')
    .waitForExist('body', SITE_LOAD_TIMEOUT)
    .pause(300)
    .elements('.list-group-item')
    .then(function(elements) {
      elements.value.forEach(function(element) {
        that.client.elementIdText(element.ELEMENT)
        .then(function(e) {
          savedUrls.push(e.value.split('\n')[0]);
          if (++count >= elements.value.length) {
            done();
          }
        });
      });
    })
  });

  it('keeps the list of sites stored', function() {
    expect(savedUrls.length).to.equal(3);
  });

  it('contains the correct list of links', function() {
    var sorted = savedUrls.sort();
    expect(sorted).to.deep.equal(urls);
  });

  var linkCheck = function(idx) {
    return function(done) {
      this.client
      .click('.win-link*=' + savedUrls[idx])
      .waitForExist('body', SITE_LOAD_TIMEOUT)
      .pause(300)
      .url(function(err, res) {
        var urlhostname = url.parse(res.value).hostname.replace(/www\./, '');
        var refhostname = url.parse(urls[idx]).hostname.replace(/www\./, '');
        expect(urlhostname).to.equal(refhostname);
      })
      .back()
      .call(done)
    };

  };

  it('allows clicking of first link', linkCheck.bind(this)(0));
  it('allows clicking of second link', linkCheck.bind(this)(1));
  it('allows clicking of third link', linkCheck.bind(this)(2));
};

module.exports = listTest;
