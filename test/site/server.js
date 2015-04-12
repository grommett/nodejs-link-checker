var express = require('express');
var app = express();
var server;

app.use(express.static(process.cwd()+'/test/site/pages'));
console.log('Tests: Serving test site out of \'',process.cwd()+'test/site/pages\'.')
module.exports = {
  port: 2307,
  start: function(portNum) {
    if(portNum) this.port = portNum;
    server = app.listen(this.port);
  },

  close: function() {
    server.close();
  }
}