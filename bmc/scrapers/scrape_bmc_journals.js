#!/usr/bin/env node

// Write on stdout the BMC journals PKB
// il ne distingue pas les titres springeropen et chemistrycentral
// possible (?) avec h3 > a.parent.parent > a.tooltip : attrib(href) permet identifieri
// http://www.springeropen.com ou http://www.chemistrycentral.com
// Write on stderr the progression
// Usage : ./scrape_bmc.js

/*jslint maxlen: 180*/

'use strict';

const request = require('request');
const cheerio = require('cheerio');
const csv     = require('csv');
const url     = require('url');

const PkbRows = require('../../.lib/pkbrows.js');
const pkb     = new PkbRows('bmc');

let titles     = new Map();
let nbScrape   = 0;
let nbJournals = 0;

// setKbartName() is required to fix the kbart output file name
// pkb.consortiumName = '';       // default empty
pkb.packageName = 'journals';
pkb.setKbartName();

getCsvList((err, csvJournals) => {
  if (err) { throw err; }

  csvJournals.forEach(journal => {
    if (journal.publication_title) {
      titles.set(journal.publication_title.toLowerCase(), journal);
    }
  });

  let pageUrl = 'http://www.biomedcentral.com/journals';

  request(pageUrl, (err, resp, body) => {
    if (err) { throw err; }

    let $ = cheerio.load(body);

    let links = $('.ListStack li[id] a').toArray();

    (function processNext() {
      let link = links.pop();
      if (!link) {
        pkb.writeKbart();
        return console.error('%d journals found, %d needed scraping', nbJournals, nbScrape);
      }

      getJournal($(link), function (err, journal) {
        if (err) { throw err; }
        if (journal) {
          nbJournals++;
          pkb.addRow(pkb.initRow(journal));
        }
        processNext();
      });
    })();
  });
});

/**
 * Take a link from the AtoZ list and find the journal in the CSV
 * If the journal does not exist in the CSV, scrape the journal page
 * In any case, the URL from the AtoZ override the one in the CSV
 */
function getJournal(link, next) {
  let href = link.attr('href');
  let text = link.text().trim();

  if (!href || !text) { return next(); }

  let journal  = titles.get(text.toLowerCase());
  let hostname = url.parse(href).hostname;

  if (journal) {
    journal['pkb-piddomain'] = hostname;
    journal['title_url'] = href;
    journal['title_id'] = getTitleID(hostname);

    return next(null, journal);
  }

  console.error('Scraping: %s', href);
  nbScrape++;

  request(href, function (err, resp, body) {
    if (err) { return next(err); }

    let $ = cheerio.load(body);

    next(null, {
      'publication_title': text,
      'title_url': href,
      'pkb-piddomain': hostname,
      'title_id': getTitleID(hostname),
      'online_identifier': $('dt:contains("ISSN:") + dd').text()
    });
  });
}

/**
 * Extract the title_id from the hostname
 */
function getTitleID(hostname) {
  let parts = hostname.split('.');
  return parts[parts.indexOf('biomedcentral') - 1];
}

/**
 * Get the official list (can be outdated compared to the AtoZ page)
 * http://www.biomedcentral.com/info/journals/biomedcentraljournallist.txt
 */
function getCsvList(callback) {
  let journalsUrl = 'http://www.biomedcentral.com/info/journals/biomedcentraljournallist.txt';

  request(journalsUrl, (err, res, body) => {
    if (err) { return callback(err); }

    csv.parse(body, {
      columns: getColumns,
      skip_empty_lines: true
    }, callback);
  });

  /**
   * Takes the first row of the csv and returns the column names
   */
  function getColumns(firstRow) {
    return firstRow.map(field => {
      field = field.trim().toLowerCase();

      switch (field) {
      case 'journal name':
        return 'publication_title';
      case 'issn':
        return 'online_identifier';
      case 'publisher':
        return 'publisher_name';
      case 'url':
        return 'title_url';
      case 'start date':
        return 'date_first_issue_online';
      }

      field = field.replace(/\W/g, '_');

      return `pkb-${field}`;
    });
  }
}
