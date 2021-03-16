#!/usr/bin/env node

// As of 2014/09/20, the KBART files can be found at http://digital-library.theiet.org/about/librarians

'use strict';
const request = require('request');
const fs      = require('fs');
const path    = require('path');

const baseURL = 'http://digital-library.theiet.org/openurl/kbart/';

const kbartFiles = [
  'journals',
  'books',
];

(function download() {
  const packageName = kbartFiles.pop();
  if (!packageName) { return; }

  const kbartUrl = baseURL + packageName;
  console.log('Downloading : %s', kbartUrl);

  const req = request.get(kbartUrl);

  req.on('error', function (err) {
    console.error('Failed to download %s (err: %s)', kbartUrl, err);
    download();
  });

  req.on('response', function (res) {
    const disposition = res.headers['content-disposition'];
    const match = /filename="?(.*?)"?$/i.exec(disposition);
    let filename;

    if (match) {
      filename = match[1];
    } else {
      console.error('Filename not found in the headers, generating one with the current date');

      const now = new Date();
      let year  = now.getFullYear().toString();
      let month = now.getMonth().toString();
      let day   = now.getDay().toString();

      if (day.length === 1) { day = '0' + day; }
      if (month.length === 1) { month = '0' + month; }

      filename = packageName + '_' + year + '-' + month + '-' + day + '.txt';
    }

    req.pipe(fs.createWriteStream(path.join(__dirname, '../pkb/', filename)))
      .on('finish', download)
      .on('error', function (err) {
        console.error('Failed to download %s (err: %s)', kbartUrl, err);
        download();
      });
  });
})();
