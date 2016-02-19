#!/usr/bin/env node

// Write on stdout the ACS journals PKB
// Write on stderr the progression
// Usage : ./scrape_erudit_journals.js


/*jslint maxlen: 180*/

'use strict';


var async   = require('async');
var request = require('request').defaults({ jar: true });
var cheerio = require('cheerio');

// to check issn is valid
//var ridchecker  = require('../../../lib/rid-syntax-checker.js');
//var issnRegExp  = new RegExp('([0-9]{4}-[0-9X]{4})');

var PkbRows = require('../../.lib/pkbrows.js');
var pkb     = new PkbRows('erudit');

// entry point: a big search on all Erudit journals
//var journalsUrl = 'http://www.erudit.org/revue/';
// browse Erudit journals page by page
var pageUrl = 'http://www.erudit.org/revue/';

// setKbartName() is required to fix the kbart output file name
//   pkb.consortiumName = '';       // default empty
pkb.packageName = 'journals';       // default AllTitles
pkb.setKbartName();

function getJournalRealUrl(journalData, cb) {
  request(journalData.url, function (err, resp, body) {
    if (err) { return cb(err); }
    var $ = cheerio.load(body);
    //console.log("trying to find real url " + $('meta').attr('content'));
    var metaContent = $('meta').attr('content');
    var match, realURL;
    if (match == /[\W]([\w/\.]+)$/.exec(metaContent)) {
      realURL = match[1];
      //console.log("found real url " + realURL);
    }
    journalData.url = 'http://www.erudit.org/revue/' + realURL;
    cb(err);
  });
}

function getJournalInfoFromOwnPage(journalData, cb) {
  var info = {};

  // initialize a kbart record
  info = pkb.initRow(info);

  request(journalData.url, function (err, resp, body) {
    if (err) { return cb(err, info); }
    //console.log("in request with url " + journalData.url);
    //console.log("body " + body);
    info.publication_title  = journalData.title;
    info.title_url = journalData.url;
    info.title_id = journalData.pid;
    var $ = cheerio.load(body);
    //console.log("titre "+ $('p[class=titre]').text());
    //issn and e-issn in the same element, written as "0065-1168 (imprimé) 1718-3243 (numérique)"
    var issn_eissn = $('div[id=infoRevue] > p[class=issn]').text();
    //console.log("issn_eissn " + issn_eissn);
    var match;
    if ((match = /([0-9]{4}-[0-9X]{4}) \(imprimé\)/.exec(issn_eissn)) !== null) {
      info.print_identifier = match[1];
    }
    if ((match = /([0-9]{4}-[0-9X]{4}) \(numérique\)/.exec(issn_eissn)) !== null) {
      info.online_identifier = match[1];
    }
    cb(err, info);
  });
}

function getJournalInfo(journalData, cb) {
  getJournalRealUrl(journalData, function (err) {
    if (err) { return cb(err); }
    getJournalInfoFromOwnPage(journalData, function (err, aboutInfo) {
      if (err) { return cb(err); }
      pkb.addRow(aboutInfo);
      cb(err);
    });
  });
}



function getNbPages(cb) {
  cb(null, 1); // only one page for Erudit
}

function getPage(pageIdx, cb) {
  var journalsInPage = [];
  var url = pageUrl;
  request(url, function (err, resp, body) {
    if (err) { return cb(err); }
    var $ = cheerio.load(body);
    //keep only Erudit journals (i.e. not Persee, not NRC, not UNB libraries)
    $('li > p > img[src="/revue/images/iconeErudit2.gif"]').each(function () {
      var p = $(this).parent();
      var a = p.children('a');
      var title = a.text().replace(/\r\n|\n|\r/gm, '');
      title = title.replace(/\s{12}/g, ' ');
      var url = a.attr('href');
      var pid = '';
      if (url) {
        pid = url.split('/')[2];
        journalsInPage.push({
          title: title,
          url: 'http://www.erudit.org' + url,
          pid: pid
        });
      } else {
        console.error('no url found for ' + title);
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

// extract number of pages to browse for Erudit journals
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
      }
      return false;
    },

    // one loop then call the callback for the next
    function (callbackPage) {
      // extract the journals url from the current page
      getPage(i++, function (err, journalsInPage) {
        if (err) { return callbackPage(err); }
        // loop on the journals url and extract information about journals
        async.mapLimit(
          journalsInPage,
          1, // number of download in parallel
          function (journalData, callbackJournal) {
            // extract info about the journal (title, eissn, pissn, pid, pidurl)
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
      console.error('Erudit scraping finished.\nFile : ' + pkb.kbartFileName + ' generated');
    }
  );

});
