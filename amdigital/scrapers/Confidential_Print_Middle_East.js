#!/usr/bin/env node
// Write on KBART file the Confidential Print Middle East PKB
// Write on stderr the progression
// Usage : ./Confidential_Print_Middle_East.js

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
var pkb         = new PkbRows('amdigital');

// setKbartName() is required to fix the kbart output file name
//pkb.consortiumName = 'BooksAndNavigator';       // default empty
pkb.packageName = 'Confidential_Print_Middle_East'; // default AllTitles
pkb.setKbartName();


var journalsUrl = 'http://galileo.museglobal.ro/~vali/Confidential_Print_Middle_East.csv';
console.error('Downloading: ' + journalsUrl);
var y = new Date();
var yeartoday = y.getFullYear();

request.get({uri: journalsUrl, encoding: 'binary'}, function (err, resp, body) {
  if (err) { throw err; }

  // convert the CSV string into a JSON object
  var csvSource = CSV.parse(body, CSV.detect(body));

  // extract the first CSV line
  //
  //"ImageDirectory","Url","Title","Reference","Date","SearchableDate","Collection","Description","Notes","DepartmentCode","Continent","Country","Places","People","Topics","Organisations"

  // extract the CSV first line (column titles)
  var csvHeader = csvSource[0].map(function (val) { return val.trim().toLowerCase(); });
  csvSource.shift(); // remove the first line from the source
  console.error('CSV first line: ' + csvHeader.join(','));
  //console.log(csvHeader);

  // search the title index
  var titleIdx = csvHeader.indexOf('title');
  console.error('Title column number: ' + titleIdx);
  // search the Reference index
  var referenceIdx  = csvHeader.indexOf('reference');
  console.error('Reference column number:  ' + referenceIdx);
  // search the date monograph published print
  var dateMonographPublishedPrintIdx  = csvHeader.indexOf('date');
  console.error('Date Monograph Published Print column number:  ' + dateMonographPublishedPrintIdx);
  // search the date monograph published online
  var dateMonographPublishedOnlineIdx  = csvHeader.indexOf('searchabledate');
  console.error('Date Monograph Published Online column number:  ' + dateMonographPublishedOnlineIdx);
  // search the url
  var urlIdx   = csvHeader.indexOf('url');
  console.error('URL column number:   ' + urlIdx);
  // search the Notes
  var notesIdx   = csvHeader.indexOf('notes');
  console.error('Notes column number:   ' + notesIdx);
  // search the Continent
  var continentIdx   = csvHeader.indexOf('continent');
  console.error('Continent column number:   ' + continentIdx);
  // search the Country
  var countryIdx   = csvHeader.indexOf('country');
  console.error('Country column number:   ' + countryIdx);
  // search the Places
  var placesIdx   = csvHeader.indexOf('places');
  console.error('Places column number:   ' + placesIdx);
  // search the People
  var peopleIdx   = csvHeader.indexOf('people');
  console.error('People column number:   ' + peopleIdx);
  // search the Topics
  var topicsIdx   = csvHeader.indexOf('topics');
  console.error('Topics column number:   ' + topicsIdx);
  // search the Collection
  var collectionIdx   = csvHeader.indexOf('collection');
  console.error('Collection column number:   ' + collectionIdx);
  // search the Department Code
  var departmentCodeIdx   = csvHeader.indexOf('departmentcode');
  console.error('Department Code column number:   ' + departmentCodeIdx);
  

  // Loop on the CSV entries
  csvSource.forEach(function (csvRow) {
    // cleanup extra spaces into the row fields
    csvRow = csvRow.map(function (val) { return val.trim(); });
    // extract data
    var journalInfo = {};
    // initialize a kbart record
    journalInfo = pkb.initRow(journalInfo);

		journalInfo.title_url     = csvRow[urlIdx];
		journalInfo.publication_title      = csvRow[titleIdx];
		journalInfo.title_id      = csvRow[referenceIdx];
		journalInfo.date_monograph_published_print     = csvRow[dateMonographPublishedPrintIdx];
		journalInfo.date_monograph_published_online    = csvRow[dateMonographPublishedOnlineIdx];
		journalInfo.collection      = 'Confidential Print: Middle East';
		journalInfo.notes        = csvRow[notesIdx];
		
		//NEW fields
		journalInfo.department_code      = csvRow[departmentCodeIdx];
		journalInfo.continent        = csvRow[continentIdx];
		journalInfo.country      = csvRow[countryIdx];
		journalInfo.places     = csvRow[placesIdx];
		journalInfo.people      = csvRow[peopleIdx];
    journalInfo.topics      = csvRow[topicsIdx];
    
    pkb.addRow(journalInfo);

  });

  // Loop on CSV row is finished, we can write the result.
  pkb.writeKbart();
  console.error('FC scraping is finished..\nFile : ' + pkb.kbartFileName + ' generated');
});

