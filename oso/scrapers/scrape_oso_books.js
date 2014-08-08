#!/usr/bin/env node
// Write a kbart file for OHB journals

/*jslint maxlen: 180*/

'use strict';


var request = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

var XLS = require('xlsjs');

var PkbRows = require('../../.lib/pkbrows.js');

var url = 'http://www.oxfordscholarship.com/fileasset/OSO_Alltitles.xls';
var fileContent = '';

request.get(url)
.on('data', function (chunk) {
  for (var i = 0; i != chunk.length; ++i) {
    fileContent += String.fromCharCode(chunk[i]);
  }
}).on('end', function () {
  var xls = XLS.read(fileContent, { type: "binary" });
  var json;

  for (var i = 0, j = xls.SheetNames.length; i < j; i++) {
    var sheet = xls.Sheets[xls.SheetNames[i]];

    json = XLS.utils.sheet_to_row_object_array(sheet);
    if (json.length > 0) { break; }
  }

  if (json.length === 0) {
    console.error('No data found in the Excel file');
    process.exit(1);
  }

  var pkb = new PkbRows('oso');
  pkb.setKbartName();

  json.forEach(function (row) {
    var kbartRow = pkb.initRow({});

    kbartRow.publication_title = row['Title'];
    kbartRow.title_url         = row['LINK'];
    kbartRow.print_identifier  = row['ISBN'];
    kbartRow['pkb-doi']        = row['DOI'];

    var match = /([a-z:]+\/[0-9]+)/.exec(row['DOI']);
    if (match) { kbartRow.title_id = match[1]; }

    pkb.addRow(kbartRow);
  });

  pkb.writeKbart();
});
