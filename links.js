/*jshint node: true */
"use strict";

var _ = require('underscore');

function links() {
  var collection = [];

  return {
    add: function(link) {
      collection.push(link);
      return this;
    },

    all: function() {
      return collection;
    },

    getLink: function(url) {
      var link = _.find(collection, function(link) {
        console.log('link.url() ', link.url(), 'url: ', url);
        return link.url() === url;
      });

      console.log('found link ', link.url());
      return link;
    },

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

module.exports = links;