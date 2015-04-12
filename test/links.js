var linkObj = require(process.cwd()+'/link.js');
var linkCollection = require(process.cwd()+'/link-collection.js');
var assert = require('assert');
var fs = require('fs');

describe(__filename, function() {
  it('should add a link to its collection', function(done) {
    var links = linkCollection.createCollection();
    links.add('http://smithandrobot.com', 'http://smithandrobot.com/a/page');
    assert.strictEqual(links.collection().length, 1);
    done();
  })

  it('should filter valid links', function(done) {
    var links = linkCollection.createCollection();
    links.add('http://smithandrobot.com', 'http://smithandrobot.com/a/page');
    links.add('mailto:david@smithandrobot.com', 'http://smithandrobot.com/a/page');
    assert.strictEqual(links.valid().length, 1);
    done();
  })

  it('should filter links that are broken', function(done) {
    var links = linkCollection.createCollection();
    var brokenLink = links.add('http://asdf.com', 'http://asdf.com/referer');
    var brokenLink2 = links.add('http://fasdf.com', 'http://asdf.com/referer');
    brokenLink.broken = true;
    assert.strictEqual(links.broken().length, 1);
    brokenLink2.broken = true;
    assert.strictEqual(links.broken().length, 2);
    done();
  })

  it('should find a link by its url', function(done) {
    var links = linkCollection.createCollection();
    var testURL = 'http://unique.com';
    var link = links.add(testURL, 'referer 1');
    assert.strictEqual(links.getLink(testURL).url(), testURL);
    done();
  })

  it('should not add a link if it already exits in the collection', function(done) {
    var links = linkCollection.createCollection();
    var url = 'http://unique.com';
    var link = links.add(url, 'referer 1');
    var oldTotal = links.collection().length;
    var link2 = links.add(url, 'referer 2');
    var newTotal = links.collection().length;
    assert.strictEqual(newTotal, oldTotal);
    done();
  })

  it('should add a \'unique\' referer to a link if the link already exists and an attempt is made to add it again', function(done) {
    var links = linkCollection.createCollection();
    var newURL = 'http://unique.com';
    var link = links.add(newURL, 'referer 1');
    var link2 = links.add(newURL, 'referer 2');
    var link3 = links.add(newURL, 'referer 2');
    assert.strictEqual(link.referers().length, 2);
    done();
  })

})