#!/usr/bin/env node

// Write a kbart file for the CBO PKB
// Write on stderr the progression
// Usage : ./scrape_cbo_books.js

/*jslint maxlen: 180*/

'use strict';

var fs      = require('fs');
var path    = require('path');
var iconv   = require('iconv-lite');
var unzip   = require('unzip');
var request = require('request');

var r = request({
  method: 'GET',
  uri: 'http://ebooks.cambridge.org/download?f=CambridgeBooks_GlobalTitleList_txt&prodCode=CBO&type=kbart',
  proxy: process.env.HTTP_PROXY || process.env.http_proxy,
  headers: {
    'User-Agent': 'node'
  }
});

r.on('error', function (err) {
  console.error(err);
  process.exit(1);
});

r.on('response', function (res) {
  if (res.statusCode != 200) {
    console.error('[Error] The server responded with a status of ' + res.statusCode + ', exiting');
    process.exit(1);
  }

  var match = /filename=(.*)$/.exec(res.headers['content-disposition']);
  var fileName;

  if (match) {
    // CambridgeBooks_GlobalTitleList_2014-07-16.zip
    fileName = match[1];
  } else {
    console.error('[Error] Couldn\'t get the name of the downloaded file');
    process.exit(1);
  }

  var filePath   = path.join(__dirname, '../pkb', fileName.replace(/\.zip$/, '.txt'));
  var fileStream = fs.createWriteStream(filePath, { encoding: 'utf8' });

  var nbEntries = 0;
  res.pipe(unzip.Parse())
  .on('entry', function (entry) {
    if (++nbEntries > 1) {
      console.error('[Warning] the zip file contains multiple entries, ignoring ' + entry.path);
      entry.autodrain();
    } else {
      console.error('[Info] writing ' + entry.path + ' into ' + filePath);
    }
    entry
    .pipe(iconv.decodeStream('utf16-le'))
    .pipe(iconv.encodeStream('utf8'))
    .pipe(fileStream);
  })
  .on('close', function () {
    console.error('[Info] Completed');
  });
});
