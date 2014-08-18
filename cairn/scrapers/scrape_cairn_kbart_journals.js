#!/usr/bin/env node

/*jslint maxlen: 180*/

'use strict';

var request = require('request').defaults({
  proxy: process.env.http_proxy ||
         process.env.HTTP_PROXY ||
         process.env.https_proxy ||
         process.env.HTTPS_PROXY
});

var iconv    = require('iconv-lite');
var cheerio  = require('cheerio');
var csvParse = require('csv').parse;
var PkbRows  = require('../../.lib/pkbrows.js');
var pkb      = new PkbRows('cairn');
pkb.setKbartName();

var kbartUrl     = 'http://dedi.cairn.info/NL/KBART/';
var allTitlesUrl = 'http://www.cairn.info/Accueil_Revues.php?TITRE=ALL';

console.error('Downloading: %s', kbartUrl);

/**
 * Browse the full title list and build a list of matching
 * between the first and second ID of journals
 * ex: revue-actuel-marx --> AMX
 */
var getMatchingList = function(callback) {
  request.get(allTitlesUrl, function (err, response, body) {
    if (err) { return callback(err); }

    var matchings = {};
    var $ = cheerio.load(body);

    $('div.revue > a > img').each(function () {
      var src = $(this).attr('src') || '';
      var m   = /\/vign_rev\/(.*?)\/.*?\.jpg/.exec(src);

      if (!m) { return; }

      var href = $(this).parent().attr('href');
      matchings[href.substr(0, href.length - 4)] = m[1];
    });

    callback(null, matchings);
  });
}

/**
 * Get the secondary ID associated with a URL
 * (if it was not found in the matching list)
 */
var getSecondaryID = function (url, callback) {

  request.get(url, function (err, response, body) {
    if (err) { return callback(err); }

    var m = /src=".*?vign_rev\/([a-z]+)\/.*?\.jpg"/i.exec(body);

    setTimeout(function () {
      callback(null, m ? m[1] : undefined);
    }, 1000);
  });
};

var req = request.get({ uri: kbartUrl });

req.on('error', function (err) {
  console.error(err);
  process.exit(1);
});

req.on('response', function (res) {
  var disposition = res.headers['content-disposition'];
  var match       = /filename="?.*([0-9]{6})\.csv"?$/.exec(disposition);
  var date;
  if (match) {
    date = '20' + match[1].substr(0, 2);
    date += '-' + match[1].substr(2, 2);
    date += '-' + match[1].substr(4, 2);
  } else {
    var now   = new Date();
    var year  = now.getFullYear().toString();
    var month = now.getMonth().toString();
    var day   = now.getDay().toString();

    if (day.length === 1) { day = '0' + day; }
    if (month.length === 1) { month = '0' + month; }

    date = year + '-' + month + '-' + day;
  }

  var filename = 'cairn_journals_' + date + '.txt';
  var journals = [];

  var parser = csvParse({ delimiter: ';', columns: true, skip_empty_lines: true });

  res
  .pipe(iconv.decodeStream('windows-1252'))
  .pipe(iconv.encodeStream('utf8'))
  .pipe(parser)
  .on('error', function (err) {
    console.error(err);
    process.exit(1);
  })
  .on('readable', function () {
    var journalInfo = pkb.initRow(parser.read());

    // http://www.cairn.info/revue-actuel-marx.htm --> revue-actuel-marx
    match = /\/([^\/]+)\.htm$/.exec(journalInfo.title_url);
    if (match) {
      journalInfo.title_id = match[1];
    }

    journals.push(journalInfo);
    pkb.addRow(journalInfo);
  })
  .on('end', function () {
    console.error('Scraping secondary identifiers');

    getMatchingList(function (err, matchings) {
      if (err) {
        console.error('Could not build matching list of secondary identifiers');
        process.exit(1);
      }

      var i = 0;
      (function scrapeJournal(callback) {
        var journal = journals[i++];
        if (!journal) { return callback(); }

        var secondaryID = matchings[journal.title_id];

        // If a matching was found, create an entry
        if (secondaryID) {
          var newJournal = {};
          for (var p in journal) { newJournal[p] = journal[p]; }
          newJournal.title_id = secondaryID;

          pkb.addRow(newJournal);
          return scrapeJournal(callback);
        }

        // If no matching found, try to browse the title URL to get the second ID
        getSecondaryID(journal.title_url, function (err, id) {
          if (err || !id) { console.error('No secondary ID found for %s', journal.title_id); }

          if (id) {
            var newJournal = {};
            for (var p in journal) { newJournal[p] = journal[p]; }
            newJournal.title_id = secondaryID;

            pkb.addRow(newJournal);
          }

          setTimeout(function() {
            scrapeJournal(callback);
          }, 1000);
        });
      })(function allDone() {
        pkb.writeKbart(function () {
          console.error('Cairn scraping is finished..');
          console.error('File : %s', pkb.kbartFileName);
        })
      });
    });
  });
});
