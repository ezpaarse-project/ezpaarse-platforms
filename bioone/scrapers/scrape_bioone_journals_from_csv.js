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

var csv         = require('csv');
var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('bioone');
var URL         = require('url');

// setKbartName() is required to fix the kbart output file name
//pkb.consortiumName = 'BioOne';       // default empty
//pkb.packageName = 'Journals'; // default AllTitles
pkb.setKbartName();


var journalsUrl = 'http://www.bioone.org/userimages/ContentEditor/1376686837415/BioOneComplete_2014_TitleList.csv';
// header line of this file
// Title,Previously Titled,Publishing Organization,BioOne Collection,ISSN,E-ISSN,Issues per Annum,Content Available on BioOne,BioOne URL

console.error('Downloading: ' + journalsUrl);

request.get({uri: journalsUrl, encoding: 'binary'}, function (err, resp, body) {
  if (err) { throw err; }

  csv()
    .from(body, { delimiter: ',', columns: true})
    .on('record', function (data) {
      var journalInfo = {}, match;
      // initialize a kbart record
      journalInfo = pkb.initRow(journalInfo);
      // collect informations
      journalInfo.publication_title = data['Title'];
      journalInfo.print_identifier = data['ISSN'];
      journalInfo.online_identifier = data['E-ISSN'];
      journalInfo.title_url = data['BioOne URL'];
      if (journalInfo.title_url.length) {
        var parsedUrl = URL.parse(journalInfo.title_url, true);
        if ((match = /\/loi\/([^\/]+)/.exec(parsedUrl.pathname))) {
          // http://www.bioone.org/loi/rama
          journalInfo.title_id = match[1];
        } else if ((match = /\/action\/showBookSeries/.exec(parsedUrl.pathname))) {
          // http://www.bioone.org/action/showBookSeries?seriesCode=rbba
          if (parsedUrl.query['seriesCode']) {
            journalInfo.title_id = parsedUrl.query['seriesCode'];
          }
        }
      }
      pkb.addRow(journalInfo);
    })
    .on('end', function() { pkb.writeKbart(); });
  console.error('BioOne scraping is finished..\nFile : ' + pkb.kbartFileName + ' generated');
});

