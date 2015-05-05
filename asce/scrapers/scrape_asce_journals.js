#!/usr/bin/env node

// Write on stdout the springer journals PKB
// Write on stderr the progression
// Usage : ./scrape_springer_journals.js

/*jslint maxlen: 180*/

'use strict';

var async       = require('async');
var request     = require('request').defaults({
  jar: true, //to accept the cookie, without which we don't have access to the correct content
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
  // proxy: 'http://proxyout.inist.fr:8080'
});

var cheerio     = require('cheerio');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('asce');

// setKbartName() is required to fix the kbart output file name
// pkb.consortiumName = '';       // default empty
pkb.packageName = 'journals'; // default AllTitles
pkb.setKbartName('asce');

// entry point: a single page with all asce journals
var journalsUrl = 'http://ascelibrary.org/journals/all_journal_titles';
// browse springer journals page by page
//var pageUrl     = 'http://ascelibrary.org/journal/%title_id%';

function getJournalInfo(journalUrl, cb) {
  var journalInfo = {};
  // initialize a kbart record
  journalInfo = pkb.initRow(journalInfo);

  request(journalUrl, function (err, resp, body) {
    if (err) { return cb(err, journalInfo); }
    var $ = cheerio.load(body);
    journalInfo.publication_title = $('.title').text();
    //var issnInfo = $('.issnInfo').text().replace('\n', '');
    var issnInfo = $('.issnInfo')
                   .first().contents()
                   //.filter(function() {
                   //  return this.nodeType == 3; //Node.TEXT_NODE;
                   //})
                   .text().replace(/\n|\r/g, "").replace(/ /g,"");
    var printISSN = "";
    if (issnInfo.match(/^ISSN/)){
      printISSN = issnInfo.replace(/^ISSN:/, "").replace(/eISSN.*/, "");
    }
    var onlineISSN = issnInfo.replace(/^(ISSN.*)?eISSN:/, "");
    console.log(printISSN + " -- " + onlineISSN);
    journalInfo.print_identifier = printISSN;
    journalInfo.online_identifier = onlineISSN;
    journalInfo.title_id   = journalUrl.split('/').pop();
    journalInfo.title_url   = journalUrl;
    pkb.addRow(journalInfo);
    //writeCSV(journalInfo);
    console.log(journalInfo)
    cb(err, journalInfo);
  });
}

function getNbPages(cb) {
  cb(null, 1); // only one page for ASCE
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  console.log(journalsUrl);
  request(journalsUrl, function (err, resp, body) {
    if (err) { return cb(err); }
    var $ = cheerio.load(body);
//    console.error($.html());
//.page > ul:nth-child(5) > li:nth-child(1)
//.page > h3:nth-child(2)
    $('.page > ul > li > a').each(function () {
//      console.error("bing: " + $(this));
//      console.error("bing: " + $(this).attr('href'));
      journalsInPage.push('http://ascelibrary.org' + $(this).attr('href'));
    });
    cb(null, journalsInPage);
  });
}

// extract number of pages to browse for springer journals
getNbPages(function (err, nbPages) {
  if (err) { return console.error(err); }

  // loop on pages
  var i = 1;
  async.until(
    function () {
      if (i > nbPages) {
        // last run
        pkb.writeKbart();
        console.error('ASCE scraping is finished..\nFile : ' + pkb.kbartFileName + ' generated');
      } else {
        console.error('Browsing page ' + i + '/' + nbPages);
      }
      return i > nbPages;
    },
    function (callbackPage) {
      // extracts the journals url from the current page
      getPage(i++, function (err, journalsInPage) {
        if (err) { return callbackPage(err); }
        // loop on the journals url and extract information about journals
        async.mapLimit(
          journalsInPage,
          1, // number of download in parallel
          function (journalUrl, callbackJournal) {
            // extract info about the journal (title, eissn, pissn, pid, url)
            getJournalInfo(journalUrl, callbackJournal);
          },
          callbackPage
        );
      });

    },
    // called when a page is finished
    function (err) {
      if (err) { return console.error(err); }
    }
  );
});

