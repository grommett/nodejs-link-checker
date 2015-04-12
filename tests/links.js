var linkObj = require(process.cwd()+'/link.js');
var links = require(process.cwd()+'/links.js')();
var assert = require('assert');
var fs = require('fs');

describe(__filename, function() {
  it('should add a link to its collection', function(done) {
    links.add(linkObj('http://smithandrobot.com'));
    assert.strictEqual(links.all().length, 1);
    done();
  })

  it('should filter valid links', function(done) {
    links.add(linkObj('mailto:david@smithandrobot.com'));
    assert.strictEqual(links.valid().length, 1);
    done();
  })

  it('should filter links that are broken', function(done) {
    var brokenLink = linkObj('http://asdf.com');
    var brokenLink2 = linkObj('http://fasdf.com');
    brokenLink.broken = true;
    brokenLink2.broken = true;
    links.add(brokenLink);
    assert.strictEqual(links.broken().length, 1);
    links.add(brokenLink2);
    assert.strictEqual(links.broken().length, 2);
    done();
  })

  it('should find a link by its url', function(done) {
    var testURL = 'http://unique.com';
    var link = linkObj(testURL);
    links.add(link);
    assert.strictEqual(links.getLink(testURL).url(), testURL);
    done();
  })
})