var request = require("request");
var _ = require("underscore");
var EventEmitter  = require('events').EventEmitter;
var cheerio = require('cheerio');
var colors = require('colors');
var nodeUrl = require('url');
var link = require('./link');
// 
var crawled = [];

// Defaults
var host = 'localhost';
var port = 80;
var protocol = 'http';
var path = '/';
var debug = false;
var broken = [];
crawler = new EventEmitter();

/*
 Crawler
*/
crawler.crawl = function(url) {
  var cleanedURL = nodeUrl.parse(url);
  console.log(cleanedURL);
  host = cleanedURL.host;
  port = cleanedURL.port;
  protocol = cleanedURL.protocol;
  path = cleanedURL.path;
  var url = protocol+'//'+host+path;
  this.emit('onstart', {url:url});
  crawlURL(url, 'start');
  return this;
}

crawler.verbose = function(val) {
  if(val !== undefined) {
    debug = val;
    return crawler;
  }
  return debug;
}

/*
 Crawl a given url. 
 Validate that we haven't already crawled it
 so it doesn't run forever.
*/

function crawlURL(url, referer) {
  var linkIndex = _.findIndex(crawled, {url:url});
  if(linkIndex !== -1 ) {
    return;
  }

  var lObj = link(url);
  crawled.push(lObj);

  var data;
  var brokenStr;
  var checkedStr;
  var index;

  var req = request(url) 
    .on('response', function(response) {
      if(response.statusCode === 200) {
        checkedStr = 'CHECKED: ' + url + ' - 200 ('+referer+')';
        if(crawler.verbose()) console.log(checkedStr.dim)
        crawler.emit('responseSuccess', {url:url, response: response});
      }else{
        brokenStr = 'BROKEN!! : ' + url + ' - '+response.statusCode+' referer: ('+ referer+ ')';
        broken.push({url: url, referer: referer, statusCode: response.statusCode});
        if(response.statusCode === 404) {
          if(crawler.verbose()) console.log(brokenStr.red);
          index = _.findIndex(crawled, {url:url});
          crawled[index].broken = true;
          crawled[index].referers = crawled[index].referers || [];
          crawled[index].referers.push(referer);
          crawler.emit('response404', {url:url, statusCode:response.statusCode, response: response});
        }else{
          if(crawler.verbose()) console.log(brokenStr.red);
          crawler.emit('responseError', {url:url, statusCode:response.statusCode, response: response});
        }
      }
    })
    .on('data', function(d) {
      data+=d;
    })
    .on('end', function(d) {
      if(url.indexOf(protocol+'://'+host) > -1) {
        getURLs(data.toString(), referer, url).forEach(function(link) {
          //console.log('crawl to ', nodeUrl.parse(link).href)
          crawlURL(link, url)
        })
      }
    })
    .on('crawlError', function(e) {
      console.log('ERROR!!: ', e , ' ', url, ' - ', 'referer: ('+referer+')');
    })
}

/*
 Gets all the urls on a page. 
 Cleans and validates them before sending them back. 
*/
function getURLs(str, referer, baseURL) {
  var cleanedURL;
  var urls = [];
  var $ = cheerio.load(str);

  $('a, img, script').each(function(i, link) {
    var domLink;
    if($(link).attr('href')) { 
      domLink = nodeUrl.parse($(link).attr('href')).href;
    }
    if($(link).attr('src')) {
      domLink = nodeUrl.parse($(link).attr('src')).href;
    }

    domLink = cleanLink(domLink);
    cleanedURL = validLink(domLink, referer);
    if(cleanedURL) { 
      urls.push(cleanedURL);
    }
  })
  return urls;
}

/* 
  Clean out link values that have any of following
  by returning an empty string 
*/
function cleanLink(link) {
  if(link===undefined) return '';

  if(link.indexOf('mailto:') > -1 || 
    link.indexOf('tel:') > -1 ||
    link.indexOf('javascript:') > -1 ||
    link.indexOf('file:') > -1 ||
    link.indexOf('data:') > -1) {
    link = ''
    return link;
  }
  return link;
}

/* 
 Check to make sure that the link is either
 a link on the site, or a link refered by our site
*/
function validLink(link, referer) {
  
  var cleanedURL = URI(link)
                   .absoluteTo(protocol+'://'+host+dir)
                   .normalize()
                   .toString();

  if(cleanedURL.indexOf(protocol+'://'+host) !== -1 || 
    referer.indexOf(protocol+'://'+host) > -1) {
    return cleanedURL
  }

  return false;
}

/*
  Emit an event that the script has finished
*/
process.on('exit', function(code) {
  var brokenStr;
  console.log('code: ', code)
  if(broken.length !== 0) {
    process.exitCode = 1;
    console.log(colors.red('\n***** %s broken links *****'), broken.length)
    broken.forEach(function(link) {
      brokenStr = 'BROKEN!! : ' + link.url + ' - '+link.statusCode+' referer: ('+ link.referer+ ')';
      console.log(brokenStr.red)
    })
  }
  crawler.emit('complete');
});

module.exports = crawler;