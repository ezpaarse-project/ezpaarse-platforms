#!/usr/bin/env node

/*jslint maxlen: 180*/

'use strict';

var request  = require('request');
var iconv    = require('iconv-lite');
var cheerio  = require('cheerio');
var csvParse = require('csv').parse;

var PkbRows = require('../../.lib/pkbrows.js');
var pkb     = new PkbRows('cairn');
pkb.packageName = 'revues';
pkb.setKbartName();

var csvUrl       = 'http://dedi.cairn.info/NL/revues_cairn_csv_2015.php';
var allTitlesUrl = 'http://www.cairn.info/Accueil_Revues.php?TITRE=ALL';

/**
 * Browse the full list of journals and build a list of matchings
 * between the first ID and the secondary ID
 * ex: journal-le-journal-litteraire --> SNI_LML
 */
var getMatchingList = function(callback) {
  request.get(allTitlesUrl, function (err, response, body) {
    if (err) { return callback(err); }

    var matchings = {};
    var $ = cheerio.load(body);

    $('div.numero > a > img').each(function () {
      var src  = $(this).attr('src') || '';
      var href = $(this).parent().attr('href');
      var m    = /\/vign_rev\/(.*?)\/.*?_[a-z][0-9]+\.jpg/i.exec(src);

      if (m) { matchings[href.substr(0, href.length - 4)] = m[1]; }
    });

    callback(null, matchings);
  });
};

/**
 * Get the ID associated with a URL
 * (if it was not found in the matching list)
 */
var getSecondaryID = function (url, callback) {

  request.get(url, function (err, response, body) {
    if (err) { return callback(err); }

    var m = /src=".*?vign_rev\/(.*?)\/.*?_[a-z][0-9]+\.jpg"/i.exec(body);

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

  var journals = [];
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
      var data      = parser.read();
      if (!data) { return; }

      var kbartInfo = pkb.initRow({
        publication_title:    data['REVUE'],
        print_identifier:     data['ISSN'],
        online_identifier:    data['ISSN VERSION EN LIGNE'],
        publisher_name:       data['EDITEUR'],
        title_url:            data['URL DE LA REVUE'],
        date_monograph_published_online: data['MISE EN LIGNE']
      });

      var m1 = /([0-9]+)$/.exec(data['PREMIER NUMERO DISPO'].trim());
      var m2 = /([0-9]+)$/.exec(data['DERNIER NUMERO DISPO'].trim());

      if (m1) { kbartInfo.num_first_vol_online = m1[1]; }
      if (m2) { kbartInfo.num_last_vol_online = m2[1]; }

      // http://www.cairn.info/journal-le-journal-litteraire.htm--> journal-le-journal-litteraire
      var match = /\/([^\/]+)\.htm$/.exec(kbartInfo.title_url);
      if (match) {
        kbartInfo.title_id = match[1];
      }

      journals.push(kbartInfo);
      pkb.addRow(kbartInfo);
    })
    .on('end', function () {

      var i = 0;
      (function scrapejournals(callback) {
        var journal = journals[i++];
        if (!journal) { return callback(); }

        var secondaryID = matchings[journal.title_id];

        // If a matching was found, create an entry
        if (secondaryID) {
          var newJournal = {};
          for (var p in journal) { newJournal[p] = journal[p]; }
          newJournal.title_id = secondaryID;

          pkb.addRow(newJournal);
          return scrapejournals(callback);
        }

        console.error('No matching found for %s, trying to scrape from the URL', journal.title_id);
        // If no matching found, try to browse the title URL to get the second ID
        getSecondaryID(journal.title_url, function (err, id) {
          if (err || !id) { console.error('No secondary ID found for %s', journal.title_id); }

          if (id) {
            var newJournal = {};
            for (var p in journal) { newJournal[p] = journal[p]; }
            newJournal.title_id = id;

            pkb.addRow(newJournal);
          }

          setTimeout(function() {
            scrapejournals(callback);
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
