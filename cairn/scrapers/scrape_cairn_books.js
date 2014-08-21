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
pkb.packageName = 'ebooks';
pkb.setKbartName();

var csvUrl                = 'http://dedi.cairn.info/NL/ouvrages_cairn_csv.php';
var ouvragesUrl           = 'http://www.cairn.info/ouvrages.php?TITRE=';

/**
 * Browse the full list of books and build a list of matchings
 * between the ISBN and the title ID
 * ex: 9782749211091 --> ERES_BOUTI_2009_01
 */
var getMatchingList = function(callback) {
  console.error('Creation of the matching list (ISBN -> title_id)');

  var matchings = {};
  var letters   = []; // Z to A

  for (var c = 'Z'.charCodeAt(0), l = c - 26; c > l; c--) {
    letters.push(String.fromCharCode(c));
  }

  /**
   * Get matchings letter by letter
   * (overall listing not available)
   */
  (function fromLetter() {
    var letter = letters.pop();
    if (!letter) { return callback(null, matchings); }

    console.error('Getting matchings for letter %s', letter);

    // Ouvrages
    request.get(ouvragesUrl + letter, function (err, response, body) {
      if (err) { return callback(err); }

      var $ = cheerio.load(body);

      $('div.revue > a > img').each(function () {
        var src  = $(this).attr('src') || '';
        var href = $(this).parent().attr('href');

        var ms = /\/vign_rev\/.*?\/(.*?)_[a-z][0-9]+ *\.jpg/i.exec(src);
        var mh = /--([0-9]{13})\.htm/i.exec(href);

        if (ms && mh) { matchings[mh[1]] = ms[1]; }
      });

      setTimeout(fromLetter, 1000);
    });
  })();

};

/**
 * Get the ID associated with a URL
 * (if it was not found in the matching list)
 */
var getID = function (url, callback) {

  request.get(url, function (err, response, body) {
    if (err) { return callback(err); }

    var m = /src=".*?vign_rev\/.*?\/(.*?)_[a-z][0-9]+\.jpg"/i.exec(body);

    setTimeout(function () {
      callback(null, m ? m[1] : undefined);
    }, 1000);
  });
};

getMatchingList(function (err, matchings) {
  if (err || !matchings || Object.keys(matchings) === 0) {
    console.error('Could not build the matching list');
    process.exit(1);
  }

  var books  = [];
  var parser = csvParse({
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    relax: true
  });

  console.error('Downloading %s', csvUrl);

  request.get({ uri: csvUrl })
  .pipe(iconv.decodeStream('windows-1252'))
  .pipe(iconv.encodeStream('utf8'))
  .pipe(parser)
  .on('error', function (err) {
    console.error(err);
    process.exit(1);
  })
  .on('readable', function () {
    books.push(parser.read());
  })
  .on('end', function () {

    var notFound     = 0;
    var foundByVisit = 0;
    var i = 0;
    (function scrapeBooks(callback) {
      var book = books[i++];
      if (!book) { return callback(); }

      var kbartInfo = pkb.initRow({
        publication_title: book['TITRE'],
        print_identifier:  book['ISBN'],
        online_identifier: book['ISBN EPUB'],
        first_author:      book['SOUS LA DIRECTION DE'],
        title_url:         book['URL DU SOMMAIRE'],
        publisher_name:    book['EDITEUR'],
        date_monograph_published_online: book['MISE EN LIGNE']
      });

      // 9782749211091 --> ERES_BOUTI_2009_01
      kbartInfo.title_id = matchings[kbartInfo.print_identifier];

      // If a matching was found, create an entry
      if (kbartInfo.title_id) {
        pkb.addRow(kbartInfo);
        return scrapeBooks(callback);
      }

      console.error('No identifier matching %s, trying to scrape from the URL', kbartInfo.print_identifier);
      // If no matching found, try to browse the title URL to get the ID
      getID(kbartInfo.title_url, function (err, id) {
        if (err || !id) { console.error('No ID found for %s', kbartInfo.title_id); }

        if (id) {
          foundByVisit++;
          kbartInfo.title_id = id;
          pkb.addRow(kbartInfo);
        } else {
          notFound++;
        }

        setTimeout(function() {
          scrapeBooks(callback);
        }, 1000);
      });
    })(function allDone() {
      pkb.writeKbart(function () {
        console.error('Cairn scraping is finished.');
        console.error('%d title_id not found', notFound);
        console.error('%d title_id found by visiting title_url', foundByVisit);
        console.error('File : %s', pkb.kbartFileName);
      });
    });
  });
});
