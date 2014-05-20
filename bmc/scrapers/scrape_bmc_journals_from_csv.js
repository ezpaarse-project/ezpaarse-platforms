#!/usr/bin/env node
// Write on stdout the BMC journals PKB
// Write on stderr the progression
// Usage : ./scrape_bmc_journals_from_csv.js

/*jslint maxlen: 180*/

'use strict';


var request     = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

var CSV         = require('csv-string');
var URL         = require('url');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('bmc');

var journalsUrl = 'http://www.biomedcentral.com/journals/biomedcentraljournallist.txt';
console.error('Downloading: ' + journalsUrl);

// setKbartName() is required to fix the kbart output file name
//   pkb.consortiumName = '';       // default empty
pkb.packageName = 'journals_from_csv'; // default AllTitles
pkb.setKbartName();

request(journalsUrl, function (err, resp, body) {
  if (err) { throw err; }

  // convert the CSV string into a JSON object
  var csvSource = CSV.parse(body, CSV.detect(body));

  // extract the CSV first line (column titles)
  var csvHeader = csvSource[0].map(function (val) { return val.trim().toLowerCase(); });
  csvSource.shift(); // remove the first line from the source
  console.error('CSV first line: ' + csvHeader.join(','));

  // search the title index
  var titleIdx = csvHeader.indexOf('journal name');
  console.error('Title column number: ' + titleIdx);
  // search the issn index
  var eissnIdx  = csvHeader.indexOf('issn');
  console.error('EISSN column number:  ' + eissnIdx);
  // search the url index (pid)
  var urlIdx   = csvHeader.indexOf('url');
  console.error('URL column number:   ' + urlIdx);
  // search the "start date" index
  var sdateIdx = csvHeader.indexOf('start date');
  console.error('"Start date" column number: ' + sdateIdx);

  // Loop on the CSV entries
  csvSource.forEach(function (csvRow) {
    // cleanup extra spaces into the row fields
    csvRow = csvRow.map(function (val) { return val.trim(); });

    // extract data
    var journalInfo = {};

    // initialize a kbart record
    journalInfo = pkb.initRow(journalInfo);


    journalInfo.publication_title      = csvRow[titleIdx];
    journalInfo.print_identifier      = '';
    journalInfo.online_identifier      = csvRow[eissnIdx];
    journalInfo.title_url     = csvRow[urlIdx];
    journalInfo['pkb-startdate']  = csvRow[sdateIdx];
    if (journalInfo.title_url) {
      var urlTmp = URL.parse(journalInfo.title_url);
      journalInfo['pkb-piddomain'] = urlTmp.host;
      if (journalInfo['pkb-piddomain'] == 'www.biomedcentral.com' ||
          journalInfo['pkb-piddomain'] == 'biomedcentral.com') {
        // first case: pid is the second part of the url path
        journalInfo.title_id = urlTmp.path.replace(/\//g, '');
      } else {
        // second case: pid is the domain
        journalInfo.title_id = journalInfo['pkb-piddomain'];
      }

      pkb.addRow(journalInfo, function (row1, row2) {
        // only keep the most recent "Start date" if same pid
        if (row1.startdate > row2.startdate) {
          return row1;
        } else {
          return row2;
        }
      });
    }

  });

  // Loop on CSV row is finished, we can write the result.
  pkb.writeKbart();
  console.error('BMC scraping finished.\nFile : ' + pkb.kbartFileName + ' generated');
});

