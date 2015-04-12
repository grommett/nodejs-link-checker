var linkObj = require(process.cwd()+'/link.js');
var assert = require('assert');
var fs = require('fs');

describe(__filename, function() {
  var link = linkObj('http://smithandrobot.com');
  var mailtoLink = linkObj('mailto:d@sandr.com');
  var jsLink = linkObj('javascript:function(){return false;}');
  var telLink = linkObj('tel:512-423-6066');
  var fileLink = linkObj('file:///Users/david/Downloads/Marketing%20Newsletter%20R2.jpg');
  var dataLink = linkObj('data:512-423-6066');

  it('should return true for a valid link', function(done) {
    assert.strictEqual(link.isValid(), true)
    done();
  });

  it('should return false for a mailto: link', function(done) {
    assert.strictEqual(mailtoLink.isValid(), false)
    done();
  });

  it('should return false for a javascript: link', function(done) {
    assert.strictEqual(jsLink.isValid(), false)
    done();
  });

  it('should return false for a tel: link', function(done) {
    assert.strictEqual(telLink.isValid(), false)
    done();
  });

  it('should return false for a file: link', function(done) {
    assert.strictEqual(fileLink.isValid(), false)
    done();
  });

  it('should return false for a data: link', function(done) {
    assert.strictEqual(dataLink.isValid(), false)
    done();
  });

  it('should be able to add one or more referers to a link', function(done) {
    assert.strictEqual(link.referer('google.com').referers().length, 1);
    assert.strictEqual(link.referer('yahoo.com').referers().length, 2);
    done();
  });

  it('should return its url', function(done) {
    assert.strictEqual(link.url(), 'http://smithandrobot.com');
    done();
  });
})