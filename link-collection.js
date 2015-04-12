/*jshint node: true */
"use strict";

var _ = require('underscore');
var linkObj = require('./link.js');

function linkCollection() {
  var collection = [];

  function isUnique(strURL) {
    var link = _.find(collection, function(link) {
      return link.url() === strURL;
    });
    return link === undefined;
  }

  return {
    /**
     If the url is unqiue it adds the link to the collection.
     If it's not unique it adds the referer if it's unique.
     Returns a link object in the collection
    */
    add: function(url, referer) {
      var link;
      if(isUnique(url)) {
        link = linkObj(url, referer);
        collection.push(link);
      }else{
        link = this.getLink(url);
        link.referer(referer);
      }
      return link;
    },

    /**
     Returns the collection
    */
    collection: function() {
      return collection;
    },

    /**
     Returns the link object for a given url
    */
    getLink: function(url) {
      return _.find(collection, function(link) {
        return link.url() === url;
      });
    },

    /**
     Returns an array of link objects that are broken
    */
    broken: function() {
      return _.filter(collection, function(link) {
        return link.broken;
      });
    },

    valid: function() {
      return _.filter(collection, function(link) {
        return link.isValid();
      });
    }
  };
}

module.exports = {
  createCollection: function() {
    return linkCollection();
  }
};