#!/usr/bin/env node
// Write on stdout the Freedom Collection (FC) journals PKB
// Write on stderr the progression
// Usage : ./scrape_fc_journals_from_csv.js

/*jslint maxlen: 180*/

'use strict';

var request     = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

var CSV         = require('csv-string');
// var URL         = require('url');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('sd');

// setKbartName() is required to fix the kbart output file name
pkb.consortiumName = 'FreedomCollection';       // default empty
pkb.packageName = 'Journals'; // default AllTitles
pkb.setKbartName();


var journalsUrl = 'http://info.sciencedirect.com/techsupport/journals/freedomcoll.csv';
console.error('Downloading: ' + journalsUrl);
var y = new Date();
var yeartoday = y.getFullYear();

request.get({uri: journalsUrl, encoding: 'binary'}, function (err, resp, body) {
  if (err) { throw err; }

  // convert the CSV string into a JSON object
  var csvSource = CSV.parse(body, CSV.detect(body));

  // extract the two CSV first lines
  //"Included Title Count ==>",,,,,,=counta(g4..g5000),=counta(h4..h5000),=counta(i4..i5000),=counta(j4..j5000),=counta(k4..k5000)
  //
  //"Full Title","ISSN","Product ID","Status","Change History","Short Cut URL","2010","2011","2012","2013","2014"
  csvSource.shift(); // remove the first line from the source
  csvSource.shift(); // remove the first line from the source

  // extract the CSV first line (column titles)
  var csvHeader = csvSource[0].map(function (val) { return val.trim().toLowerCase(); });
  csvSource.shift(); // remove the first line from the source
  console.error('CSV first line: ' + csvHeader.join(','));
  // search the title index
  var titleIdx = csvHeader.indexOf('full title');
  console.error('Title column number: ' + titleIdx);
  // search the issn index
  var pissnIdx  = csvHeader.indexOf('issn');
  console.error('PISSN column number:  ' + pissnIdx);
  // search the url index (pidiurl)
  var urlIdx   = csvHeader.indexOf('short cut url');
  console.error('URL column number:   ' + urlIdx);
  // search the ID product (pid)
  var idIdx   = csvHeader.indexOf('product id');
  console.error('URL column number:   ' + idIdx);
  // search the current year index
  var currentYearIdx = csvHeader.indexOf(String(yeartoday));
  console.error('current year (' + yeartoday + ') column number: ' + currentYearIdx);

  // Loop on the CSV entries
  csvSource.forEach(function (csvRow) {
    // cleanup extra spaces into the row fields
    csvRow = csvRow.map(function (val) { return val.trim(); });
    // extract data
    var journalInfo = {};
    // initialize a kbart record
    journalInfo = pkb.initRow(journalInfo);

    if (/Included/.test(csvRow[currentYearIdx])) {
      var match;

      journalInfo.publication_title      = csvRow[titleIdx];
//    journalInfo.pissn      = csvRow[pissnIdx];
      if ((match = /([0-9]{4})([0-9]{3}[0-9Xx])/.exec(csvRow[pissnIdx])) !== null) {
        journalInfo.print_identifier = match[1] + '-' + match[2];
      }
      journalInfo.online_identifier      = '';
      journalInfo.title_url     = csvRow[urlIdx];
  //    journalInfo.pid        = csvRow[idIdx]; // le product ID reflete une filiation, mais les issn et les url sont differentes
      journalInfo.title_id        = csvRow[pissnIdx];
      pkb.addRow(journalInfo);
    }
  });

  // Loop on CSV row is finished, we can write the result.
  pkb.writeKbart();
  console.error('FC scraping is finished..\nFile : ' + pkb.kbartFileName + ' generated');
});

