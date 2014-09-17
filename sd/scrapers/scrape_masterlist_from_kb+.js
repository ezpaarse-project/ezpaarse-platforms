#!/usr/bin/env node
// Write on KBART file the Freedom Collection (FC) journals PKB
// Write on stderr the progression

// 
/*jslint maxlen: 180*/

'use strict';

var request     = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

// var URL         = require('url');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('sd');

// setKbartName() is required to fix the kbart output file name
pkb.consortiumName = 'KB+Masterlists';       // default empty
pkb.packageName = 'Journals'; // default AllTitles
pkb.setKbartName();


// we use json JUSP format because CSV is not well formated : eg non quoted " in title
// json format contains a header like this :
/*{ header: 
     { version: '2.0',
       jcid: '',
       url: 'uri://kbplus/pkg/512',
       pkgcount: 3332 },
    titles: 
     [ { title: 'AASRI Procedia',
         issn: '2212-6716',
         eissn: null,
         jusp: '13472',
         startDate: '2012-01-01',
         endDate: '',
         startVolume: '1',
         endVolume: '',
         startIssue: '',
         endIssue: '',
         embargo: '',
         titleUrl: 'http://www.sciencedirect.com/science/journal/22126716',
         doi: '',
         coverageDepth: 'fulltext',
         coverageNote: null,
         publisher: null },
       { title: 'Academic Pediatrics',
**/

var journalsUrl = 'http://www.kbplus.ac.uk/kbplus/publicExport/pkg/512?format=json';
console.error('Downloading: ' + journalsUrl);

request.get({uri: journalsUrl, encoding: 'binary'}, function (err, resp, body) {
  if (err) { throw err; }

  // convert the result string into a JSON object
  var jsonSource = JSON.parse(body);
  if (jsonSource.header.pkgcount) {
    console.error('Masterlist contains ' + jsonSource.header.pkgcount + ' items');
  } else {
    throw "KB+ file doesn't contains header";
  }

  jsonSource.titles.forEach(function (jsonRow) {
    // extract data
    var journalInfo = {};
    // initialize a kbart record
    journalInfo = pkb.initRow(journalInfo);
    if (jsonRow.title && jsonRow.title !== null) {
      journalInfo.publication_title = jsonRow.title;
    }
    if (jsonRow.titleUrl && jsonRow.titleUrl !== null) {
      journalInfo.title_url = jsonRow.titleUrl;
      // make title_id form last part of titleUrl
      var titleUrlParts = jsonRow.titleUrl.split('/');
      if (titleUrlParts.length) {
        journalInfo.title_id = titleUrlParts[titleUrlParts.length - 1];
      }
    } 
    if (jsonRow.issn && jsonRow.issn !== null ) {
      journalInfo.print_identifier = jsonRow.issn;
    }
    if (jsonRow.eissn && jsonRow.eissn !== null) {
      journalInfo.online_identifier = jsonRow.eissn;
    }
    if (jsonRow.publisher && jsonRow.publisher !== null) {
      journalInfo.publisher_name = jsonRow.publisher;
    }

    pkb.addRow(journalInfo);

  });


  // Loop on JSON row is finished, we can write the result.
  pkb.writeKbart();
  console.error('Masterlist scraping is finished..\nFile : '
   + pkb.kbartFileName + ' generated with ' + pkb.rows.length + ' elements');
});

