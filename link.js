/*jshint node: true */
/*jshint scripturl:true*/
"use strict";
var _ = require('underscore');

function link(str, referer) {
  var referers = [];
  var url = str;

  if(referer) referers.push(referer);

  return {
    broken: false,
    valid: true,
    statusCode: undefined,
    
    url: function() {
      return url;
    },

    referer: function(ref) {
      if(ref) {
        if(!_.includes(referers, ref)) {
          referers.push(ref);
        }
      }
      return this;
    },

    referers: function() {
      return referers;
    },

    isValid: function() {
      if(url===undefined) return false;
      if(url.indexOf('mailto:') > -1 || 
        url.indexOf('tel:') > -1 ||
        url.indexOf('javascript:') > -1 ||
        url.indexOf('file:') > -1 ||
        url.indexOf('data:') > -1) {
        return false;
      }
      return true;
    }
  };
}

module.exports = link;