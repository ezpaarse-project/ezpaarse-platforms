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

var XLSX = require('xlsx');
var URL  = require('url');
var fs   = require('fs');

var PkbRows = require('../../.lib/pkbrows.js');

request.get('http://www.oxfordhandbooks.com/page/title-lists', function (err, response, body) {
  if (err) {
    console.error('Could not get the title-lists page');
    process.exit(1);
  }

  var match = /href="([^"]+LIST_ALL[^"]+)"/i.exec(body);

  if (!match) {
    console.error('Could not find the link to the overall title-list');
    process.exit(1);
  }

  var url = 'http://www.oxfordhandbooks.com' + match[1];

  var fileContent = '';

  request.get(url)
  .on('data', function (chunk) {
    for (var i = 0; i != chunk.length; ++i) {
      fileContent += String.fromCharCode(chunk[i]);
    }
  }).on('end', function () {

    var xlsx = XLSX.read(fileContent, { type: "binary" });
    var json;

    for (var i = 0, j = xlsx.SheetNames.length; i < j; i++) {
      var sheet = xlsx.Sheets[xlsx.SheetNames[i]];

      json = XLSX.utils.sheet_to_json(sheet, { header: "A" });
      if (json.length > 0) { break; }
    }

    if (json.length === 0) {
      console.error('No data found in the Excel file');
      process.exit(1);
    }

    var headers = json[1]; // first line is a big merged cell containing the document title

    /**
     * Get matchings between PKB fields and column letters
     * Ex: "C" -> publication_type
     */
    var fields = {};
    for (var h in headers) {
      var value = headers[h];
      if (typeof value !== 'string') { continue; }

      switch (value.trim().toLowerCase()) {
      case 'handbook':
        fields['publication_title'] = h;
        break;
      case 'online isbn':
        fields['online_identifier'] = h;
        break;
      case 'print isbn':
        fields['print_identifier'] = h;
        break;
      case 'doi':
        fields['pkb-doi'] = h;
        break;
      case 'url':
        fields['title_url'] = h;
        break;
      case 'handbook/ article?':
        fields['publication_type'] = h;
        break;
      }
    }

    var pkb       = new PkbRows('ohb');
    var doiColumn = fields['pkb-doi'];
    pkb.setKbartName();

    for (var i = 2, l = json.length; i < l; i++) {
      var row      = json[i];
      var kbartRow = pkb.initRow({});

      for (var f in fields) { kbartRow[f] = row[fields[f]]; }

      if (kbartRow.publication_type.toLowerCase() === 'article') { continue; }

      var match = /([a-z]+\/[0-9]+)/.exec(row[doiColumn]);
      if (match) { kbartRow.title_id = match[1]; }

      pkb.addRow(kbartRow);
    }

    pkb.writeKbart();
  });
});
