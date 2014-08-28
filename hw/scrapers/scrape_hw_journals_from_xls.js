#!/usr/bin/env node
// Write a kbart file with the HW journals PKB
// Write on stderr the progression
// Usage : ./scrape_hw_journals_from_xsl.js

/*jslint maxlen: 180*/

'use strict';


var request     = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

// var CSV         = require('csv-string');
var XLS         = require('xlsjs');
var URL         = require('url');
var fs          = require('fs');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('hw');

// setKbartName() is required to fix the kbart output file name
//   pkb.consortiumName = '';       // default empty
//   pkb.packageName = 'AllTitles'; // default AllTitles
pkb.setKbartName();

// parse XLS and create a PKB from it
function parseXLS(xls) {
  var xlsJsonObject = {};
  xls.SheetNames.forEach(function (sheetName) {
    var rowArray = XLS.utils.sheet_to_row_object_array(xls.Sheets[sheetName]);
    if (rowArray.length > 0) {
      xlsJsonObject[sheetName] = rowArray;
    }
  });

  var rowJournal = xlsJsonObject.Sheet1;

  var expTitle = new RegExp("Journal Title", "i");
  var expPissn = new RegExp("print ISSN", "i");
  var expEissn = new RegExp("online ISSN", "i");
  var expUrl = new RegExp("main URL", "i");

  for (var i = 0; i < rowJournal.length; i++) {

    // extract data
    var journalInfo = {};
    // initialize a kbart record
    journalInfo = pkb.initRow(journalInfo);

    var key = Object.keys(rowJournal[i]);

    for (var j = 0 ; j < key.length ; j++) {
      if (expTitle.test(key[j])) { journalInfo.publication_title  = rowJournal[i][key[j]].trim(); }
      if (expPissn.test(key[j])) { journalInfo.print_identifier  = rowJournal[i][key[j]].trim(); }
      if (expEissn.test(key[j])) { journalInfo.online_identifier  = rowJournal[i][key[j]].trim(); }
      if (expUrl.test(key[j])) {
        journalInfo.title_url  = rowJournal[i][key[j]].trim();
        journalInfo.title_id = URL.parse(journalInfo.title_url).host.trim();
        journalInfo['pkb-piddomain'] = journalInfo.pid;
      }
    }
    pkb.addRow(journalInfo);
  }

  // Loop on CSV row is finished, we can write the result.
  pkb.writeKbart();
  console.error('HW scraping finished.\nFile : ' + pkb.kbartFileName + ' generated');
}
/* xlsJsonObject
{ Sheet1:
   [ { 'Journal Title: Revised: February 4, 2014': 'AADE in Practice',
       'Who is publisher?': 'SAGE Publications  ',
       'What is the main URL for the journal site?': 'http://aip.sagepub.com ',
       'What is the online ISSN number?': '2325-5161 ',
       'What is the print ISSN number?': '2325-1603 ',
       'What is the range of content online?': 'Earliest PDF FullText date: Jan 01, 2013 ',
       'Are there free back issues?': 'No ',
       'Is this a free site?': 'No ',
       'Start-Date of Full-Text': '1-Jan-2013',
       'End-Date of Full-Text': 'current' },
[...]
     { 'Journal Title: Revised: February 4/2014': 'Youth Violence and Juvenile Justice',
       'Who is publisher?': 'SAGE Publications ',
       'What is the main URL for the journal site?': 'http://yvj.sagepub.com ',
       'What is the online ISSN number?': '1556-9330 ',
       'What is the print ISSN number?': '1541-2040 ',
       'What is the range of content online?': 'Earliest PDF FullText date: Jan 01, 2003 ',
       'Are there free back issues?': 'No ',
       'Is this a free site?': 'No ',
       'Start-Date of Full-Text': '1-Jan-2003',
       'End-Date of Full-Text': 'current' } ] }
*/

// download the XLS from Internet
var journalUrl = 'http://highwire.stanford.edu/librarians/AtoZList.xls';
var localFile  = __dirname + '/AtoZList.xls';
// var localFileStream = fs.createWriteStream(localFile);
console.error('HW scraper requesting file ' + journalUrl + ' on server');
request({ url: journalUrl, encoding: null /* so body is a binary buffer */ }, function (err, res, body) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  if (res.statusCode != 200) {
    console.error(journalUrl + ' cannot be downloaded (status = ' + res.statusCode + ')');
    process.exit(1);
  }

  console.error(localFile + ' downloaded');
  fs.writeFileSync(localFile, body);
  parseXLS(XLS.readFile(localFile));
});


