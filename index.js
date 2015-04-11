var crawler = require('./crawler');


crawler
  .on('start', function(e) {
    console.log('started', e);
  })
  .on('responseSuccess', function(e) {
    //console.log('Success')
  })
  .on('response404', function() {
    console.log('404');
  })
  .on('complete', function() {
    console.log('Crawl Complete');
  })
  .verbose(true)
  .crawl('https://www.labviewmakerhub.com');
