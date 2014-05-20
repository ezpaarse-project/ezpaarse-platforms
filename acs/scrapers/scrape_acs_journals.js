#!/usr/bin/env node

// Write a kbart file with the ACS journals PKB
// Write on stderr the progression
// Usage : ./scrape_acs_journals.js

/*jslint maxlen: 180*/

'use strict';

var async       = require('async');
var request     = require('request').defaults({
  jar: true,
  proxy:  process.env.HTTP_PROXY ||
          process.env.HTTPS_PROXY ||
          process.env.http_proxy
});
var cheerio     = require('cheerio');

// to check issn is valid
var ridchecker  = require('../../../lib/rid-syntax-checker.js');
var issnRegExp  = new RegExp('([0-9]{4}-[0-9X]{4})');

var PkbRows     = require('../../.lib/pkbrows.js');
var pkb         = new PkbRows('acs');

// entry point: a big search on all ACS journals
var journalsUrl = 'http://pubs.acs.org';
// browse ACS journals page by page
var pageUrl     = 'http://pubs.acs.org';

// setKbartName() is required to fix the kbart output file name
//   pkb.consortiumName = '';       // default empty
pkb.packageName = 'journals'; // default AllTitles
pkb.setKbartName();


function getJournalInfoFromAbout(aboutUrl, cb) {
  var info = {};

  // initialize a kbart record
  info = pkb.initRow(info);

  request(aboutUrl, { followRedirect: false }, function (err, resp, body) {
    var tmp;

    if (err) { return cb(err, info); }
    var $ = cheerio.load(body);
    info.publication_title  = $('#journalLogo img').attr('alt');
    $('.fullBox div').each(function () {
      var divText = $(this).text().trim();
      if (divText.indexOf('Print Edition ISSN:') != -1) {
        tmp = divText.match(issnRegExp);
        // check that the issn is valid
        if (tmp && tmp[0] && ridchecker.getISSN(tmp[0]).isValid) {
          info.print_identifier = tmp[0];
        }
      }
      if (divText.indexOf('Web Edition ISSN:') != -1) {
        tmp = divText.match(issnRegExp);
        // check that the issn is valid
        if (tmp && tmp[0] && ridchecker.getISSN(tmp[0]).isValid) {
          info.online_identifier = tmp[0];
        }
      }
    });
    info.title_id  = aboutUrl.split('/').slice(-2, -1).pop();
    info.title_url = aboutUrl;
    cb(err, info);
  });
}

function getJournalInfoFromIndex(indexUrl, aboutInfo, cb) {
  // clone aboutInfo
  var extend = require('util')._extend;
  var info = extend({}, aboutInfo);

  request(indexUrl, { followRedirect: false }, function (err, resp, body) {
    if (err) { return cb(err, info); }
    var $ = cheerio.load(body);

    // ex: <a href="/doi/abs/10.1021/am402635p">Liquid-Infused Slippery Surfaces ...</a>
    var hrefOrig = $('.articleBoxMeta .titleAndAuthor h2 > a').first().attr('href');
    try {
      var hrefDump = hrefOrig.split('/');
      if (hrefDump[1] == 'doi') {
        info.title_id    = hrefDump.slice(-1)[0].slice(0, 2);
        info.title_url = journalsUrl + hrefOrig;
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error('Skiping ' + indexUrl + ' (no articles with DOI found in the page)');
      return cb(null, {});
    }
    cb(err, info);
  });
}

function getJournalInfo(journalData, cb) {
  // ex: http://pubs.acs.org/page/aamick/about.html
  getJournalInfoFromAbout(journalData.about, function (err, aboutInfo) {
    if (err) { return cb(err); }
    pkb.addRow(aboutInfo);

    // ex: http://pubs.acs.org/journal/aamick
    getJournalInfoFromIndex(journalData.index, aboutInfo, function (err, indexInfo) {
      if (err) { return cb(err); }
      if (indexInfo.title_id) {
        pkb.addRow(indexInfo);
      }
      cb(err);
    });
  });
}

function getNbPages(cb) {
  cb(null, 1); // only one page for ACS
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  var url = pageUrl;
  request(url, function (err, resp, body) {
    if (err) { return cb(err); }
    var $ = cheerio.load(body);
    $('#azView li > a').each(function () {
      var href = $(this).attr('href');
      // keep only journals
      if (new RegExp('^/journal/').test(href)) {
        // skip http://pubs.acs.org/journal/jpchax.1 http://pubs.acs.org/journal/jpchax.2 ...
        if (!new RegExp('\\.[0-9]$').test(href)) {
          var title_id = href.split('/').pop();
          journalsInPage.push({
            index: journalsUrl + '/journal/' + title_id,
            about: journalsUrl + '/page/' + title_id + '/about.html'
          });
        } else {
          console.error('Skiping (archives) ' + journalsUrl + href);
        }
      } else {
        console.error('Skiping (not a journal) ' + journalsUrl + href);
      }
    });
    // deduplicate array content
    var journalsInPage2 = journalsInPage.filter(function (elem, pos, self) {
      return self.indexOf(elem) == pos;
    });
    //console.log(journalsInPage2);
    cb(null, journalsInPage2);
  });
}

// extract number of pages to browse for ACS journals
getNbPages(function (err, nbPages) {
  if (err) { throw err; }

  // loop on pages
  var i = 1;
  async.until(

    // loop until this condition
    function () {
      if (i > nbPages) {
        console.error('Browsing page ' + i + '/' + nbPages);
        return true;
      } else {
        return false;
      }
    },

    // one loop then call the callback for the next
    function (callbackPage) {
      // extracte the journals url from the current page
      getPage(i++, function (err, journalsInPage) {
        if (err) { return callbackPage(err); }
        // loop on the journals url and extract information about journals
        async.mapLimit(
          journalsInPage,
          1, // number of download in parallel
          function (journalData, callbackJournal) {
            // extract info about the journal (title, eissn, pissn, title_id, title_url)
            getJournalInfo(journalData, callbackJournal);
          },
          callbackPage
        );
      });
    },
    // called when all pages are handled (loops finished)
    function (err) {
      if (err) { throw err; }
      pkb.writeKbart();
      console.error('Scraping finished.\nFile : ' + pkb.kbartFileName + ' generated');
    }
  );
});
