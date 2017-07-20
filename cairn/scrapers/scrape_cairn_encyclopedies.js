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
pkb.packageName = 'encyclopedies';
pkb.setKbartName();

var csvUrl       = 'http://dedi.cairn.info/NL/ep_cairn_csv_2015.php';
var allTitlesUrl = 'http://www.cairn.info/encyclopedies-de-poche.php?POS_DISC=&TITRE=ALL';

/**
 * Browse the full list of encyclopedies and build a list of matchings
 * between the ISBN and the title ID
 * ex: 9782130574286 --> PUF_GOUNE_2009_01
 */
var getMatchingList = function(callback) {
  request.get(allTitlesUrl, function (err, response, body) {
    if (err) { return callback(err); }

    var matchings = {};
    var $ = cheerio.load(body);

    $('div.revue > a > img').each(function () {
      var src  = $(this).attr('src') || '';
      var href = $(this).parent().attr('href');

      var ms = /\/vign_rev\/.*?\/(.*?)_[a-z][0-9]+\.jpg/i.exec(src);
      var mh = /--([0-9]{13})\.htm/i.exec(href);

      if (ms && mh) { matchings[mh[1]] = ms[1]; }
    });

    callback(null, matchings);
  });
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

console.error('Creation of the matching list');
getMatchingList(function (err, matchings) {
  if (err) {
    console.error('Could not build the matching list');
    process.exit(1);
  }

  var encyclopedies = [];
  var parser = csvParse({ delimiter: ';', columns: true, skip_empty_lines: true });

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
      encyclopedies.push(parser.read());
    })
    .on('end', function () {


      var i = 0;
      (function scrapeEncyclopedies(callback) {
        var encyclopedia = encyclopedies[i++];
        if (!encyclopedia) { return callback(); }

        var kbartInfo = pkb.initRow({
          publication_title: encyclopedia['TITRE'],
          print_identifier:  encyclopedia['ISBN'],
          online_identifier: encyclopedia['ISBN EPUB'],
          first_author:      encyclopedia['AUTEUR'],
          title_url:         encyclopedia['URL DU SOMMAIRE'],
          date_monograph_published_online: encyclopedia['MISE EN LIGNE']
        });

        // 9782130574286 --> PUF_GOUNE_2009_01
        kbartInfo.title_id = matchings[kbartInfo.print_identifier];

        // If a matching was found, create an entry
        if (kbartInfo.title_id) {
          pkb.addRow(kbartInfo);
          return scrapeEncyclopedies(callback);
        }

        console.error('No identifier matching %s, trying to scrape from the URL', kbartInfo.title_id);
        // If no matching found, try to browse the title URL to get the ID
        getID(kbartInfo.title_url, function (err, id) {
          if (err || !id) { console.error('No ID found for %s', kbartInfo.title_id); }

          if (id) {
            kbartInfo.title_id = id;
            pkb.addRow(kbartInfo);
          }

          setTimeout(function() {
            scrapeEncyclopedies(callback);
          }, 1000);
        });
      })(function allDone() {
        pkb.writeKbart(function () {
          console.error('Cairn scraping is finished..');
          console.error('File : %s', pkb.kbartFileName);
        });
      });
    });
});
