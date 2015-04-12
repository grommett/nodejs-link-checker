var server = require('./site/server');
var crawler = require(process.cwd()+'/crawler2.js');

describe(__filename, function() {
  before(function() {
    server.start();
  })

  after(function() {
    server.close();
  })

  it('should all links and assets on a page', function(done) {
    linkChecker = crawler.crawl('http://localhost:'+server.port);
    linkChecker.on('done', function() {
      done();
    })
  })
})