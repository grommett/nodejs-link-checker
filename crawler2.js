var request = require("request");
var _ = require("underscore");
var EventEmitter  = require('events').EventEmitter;
var cheerio = require('cheerio');
var colors = require('colors');
var nodeUrl = require('url');
var link = require('./link');

var emitter = new EventEmitter();


function crawlURL(url, ref) {
  var req = request(url);
  var data = '';
  req.on('response', handleResponse);
  req.on('data', function(resData) {
    data+=resData;
  });
  req.on('end', function(){
    handleEnd(data);
  });

}

function handleResponse(res) {
  console.log('Response status: ',res.statusCode);
  emitter.emit('done');
}

function handleEnd(data) {
  console.log(data);
}

function getURLs(d) {
 var $ = cheerio.load(d);
 var links = $('a img script iframe');
 return links;
}

// function getAllLinks(res)

module.exports = {
  crawl: function(url) {
    crawlURL(url);
    return emitter;
  }
};