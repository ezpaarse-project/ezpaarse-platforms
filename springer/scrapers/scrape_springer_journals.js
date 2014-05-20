#!/usr/bin/env node

// Write on stdout the springer journals PKB
// Write on stderr the progression
// Usage : ./scrape_springer_journals.js

/*jslint maxlen: 180*/

'use strict';

var async       = require('async');
var request     = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
  // proxy: 'http://proxyout.inist.fr:8080'
});

var cheerio     = require('cheerio');
var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('springer');

// setKbartName() is required to fix the kbart output file name
// pkb.consortiumName = '';       // default empty
pkb.packageName = 'journals'; // default AllTitles
pkb.setKbartName();

// entry point: a big search on all springer journals
var journalsUrl = 'http://link.springer.com/search?facet-content-type=%22Journal%22';
// browse springer journals page by page
var pageUrl     = 'http://link.springer.com/search/page/%pageIdx%?facet-content-type=%22Journal%22';




function getJournalInfo(journalUrl, cb) {
  var journalInfo = {};
  // initialize a kbart record
  journalInfo = pkb.initRow(journalInfo);

  request(journalUrl, function (err, resp, body) {
    if (err) { return cb(err, journalInfo); }
    var $ = cheerio.load(body);
    journalInfo.publication_title = $('#title').text();
    journalInfo.print_identifier = $('.pissn').first().text().replace(' (Print)', '');
    journalInfo.onlineidentifier = $('.eissn').first().text().replace(' (Online)', '');
    journalInfo.title_id   = journalUrl.split('/').pop();
    journalInfo.title_url   = journalUrl;
    pkb.addRow(journalInfo);
    //writeCSV(journalInfo);
    //console.log(journalInfo)
    cb(err, journalInfo);
  });
}

function getNbPages(cb) {
  request(journalsUrl, function (err, resp, body) {
    if (err) { return cb(err); }
    var $ = cheerio.load(body);
    cb(err, $('.number-of-pages').first().text());
  });
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  var url = pageUrl.replace("%pageIdx%", pageIdx);
  request(url, function (err, resp, body) {
    if (err) { return cb(err); }
    var $ = cheerio.load(body);
    $('#results-list a.title').each(function () {
      journalsInPage.push('http://link.springer.com' + $(this).attr('href'));
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
        console.error('Springer scraping is finished..\nFile : ' + pkb.kbartFileName + ' generated');
      } else {
        console.error('Browsing page ' + i + '/' + nbPages);
      }
      return i > nbPages;
    },
    function (callbackPage) {
      // extracte the journals url from the current page
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

