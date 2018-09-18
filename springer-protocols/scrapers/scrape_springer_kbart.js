#!/usr/bin/env node

// As of 2014/01/28, the KBART files can be found at http://link.springer.com/lists/


'use strict';
var request   = require('request');
var fs        = require('fs');
var path      = require('path');
var Transform = require('stream').Transform;
//var util      = require('util');

var baseURL = 'http://static-content.springer.com/kbart/complete_packages/';

var kbartFiles = [
  'Springer_Global_Complete_Protocols'
];

(function download() {
  var packageName = kbartFiles.pop();
  if (!packageName) { return; }

  var kbartUrl = baseURL + packageName;
  console.log('Downloading : %s', kbartUrl);

  var req = request.get(kbartUrl);

  req.on('error', function (err) {
    console.error('Failed to download %s (err: %s)', kbartUrl, err);
    download();
  });

  req.on('response', function (res) {
    var disposition = res.headers['content-disposition'];
    var match       = /filename="?(.*?)"?$/i.exec(disposition);
    var filename;

    if (match) {
      filename = match[1];
    } else {
      console.error('Filename not found in the headers, generating one with the current date');

      var now   = new Date();
      var year  = now.getFullYear().toString();
      var month = now.getMonth().toString();
      var day   = now.getDay().toString();

      if (day.length === 1) { day = '0' + day; }
      if (month.length === 1) { month = '0' + month; }

      filename = packageName + '_' + year + '-' + month + '-' + day + '.txt';
    }

    req.pipe(new EscapeStream())
      .pipe(fs.createWriteStream(path.join(__dirname, '../pkb/', filename)))
      .on('finish', download)
      .on('error', function (err) {
        console.error('Failed to download %s (err: %s)', kbartUrl, err);
        download();
      });
  });
})();


/**
 * A stream that change double quotes into single
 * Prevents the csv parser from crashing
 */
function EscapeStream(options) {
  Transform.call(this, options);
}
require('util').inherits(EscapeStream, Transform);

EscapeStream.prototype._transform = function (chunk, encoding, callback) {
  this.push(chunk.toString().replace(/"/g, '\''));
  callback();
};
