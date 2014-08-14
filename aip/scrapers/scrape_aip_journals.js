#!/usr/bin/env node

/*jslint maxlen: 180*/

'use strict';

var fs      = require('fs');
var path    = require('path');
var request = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});


var kbartUrl = 'http://scitation.aip.org/admin/reporting/kbart/report.action?reportName=Journals&format=txt';

console.error('Downloading: %s', kbartUrl);

var req = request.get(kbartUrl);

req.on('response', function (res) {
  var disposition = res.headers['content-disposition'];
  var match       = /filename="(.*?)"$/.exec(disposition);
  var filename;

  if (match) {
    filename = match[1];
  } else {
    console.error('Filename not found in headers, generating one with current date');

    var now   = new Date();
    var year  = now.getFullYear().toString();
    var month = now.getMonth().toString();
    var day   = now.getDay().toString();

    if (day.length === 1) { day = '0' + day; }
    if (month.length === 1) { month = '0' + month; }

    filename = 'aip_journals_' + year + '-' + month + '-' + day + '.txt';
  }

  var file = path.join(__dirname, '../pkb/', filename);
  res.pipe(fs.createWriteStream(file))
  .on('error', function (err) {
    console.error(err);
    process.exit(1);
  })
  .on('finish', function () {
    console.error('KBart downloaded to %s', file);
  });
});

req.on('error', function (err) {
  console.error(err);
  process.exit(1);
});
