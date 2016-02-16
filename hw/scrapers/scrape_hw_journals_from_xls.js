#!/usr/bin/env node
// Generate a kbart file with the journals of Highwire
// Write the progression in stderr
// Usage : ./scrape_hw_journals_from_xsl.js

/*jslint maxlen: 180*/

'use strict';

const request = require('request');
const cheerio = require('cheerio');
const XLS     = require('xlsjs');
const URL     = require('url');

const PkbRows = require('../../.lib/pkbrows.js');
const pkb     = new PkbRows('hw');

pkb.setKbartName();

let atozUrl = 'http://highwire.stanford.edu/librarians/AtoZList.xls';

console.error(`Downloading ${atozUrl}`);

request({ url: atozUrl, encoding: null }, (err, res, body) => {
  if (err) { throw err; }
  if (res.statusCode != 200) {
    console.error(`Download failed (status = ${res.statusCode})`);
    process.exit(1);
  }

  console.error('Parsing the Excel file');
  parseXLS(body);

  console.error('Scraping GSW journals');
  scrapeGSW(err => {
    if (err) { throw err; }

    pkb.writeKbart();
    console.error(`Kbart file generated. Path : ${pkb.kbartFileName}`);
  });
});

// parse XLS and create a PKB from it
function parseXLS(xlsContent) {
  let xls   = XLS.read(xlsContent);
  let sheet = xls.Sheets['Sheet1'];

  if (!sheet) {
    console.error('Sheet "Sheet1" not found');
    process.exit(1);
  }

  let rows  = XLS.utils.sheet_to_row_object_array(sheet);

  rows.forEach(row => {
    let journalInfo = pkb.initRow({});

    for (let p in row) {
      let lp = p.toLowerCase();

      if (lp.includes('journal title')) { journalInfo.publication_title = row[p].trim(); }
      if (lp.includes('print issn'))    { journalInfo.print_identifier  = row[p].trim(); }
      if (lp.includes('online issn'))   { journalInfo.online_identifier = row[p].trim(); }
      if (lp.includes('publisher'))     { journalInfo.publisher_name    = row[p].trim(); }
      if (lp.includes('main url')) {
        journalInfo.title_url = row[p].trim();
        journalInfo.title_id  = URL.parse(journalInfo.title_url).host;
        journalInfo['pkb-piddomain'] = journalInfo.title_id;
      }
    }

    pkb.addRow(journalInfo);
  });
}

function scrapeGSW(callback) {
  let gswJournals = 'http://www.geoscienceworld.org/site/misc/journals_glance.xhtml';

  request(gswJournals, (err, res, body) => {
    if (err) { return callback(err); }

    let columns;
    let $ = cheerio.load(body);

    $('table tr').each((index, element) => {
      let tds = $(element).children();

      if (columns) {
        let journal = pkb.initRow({});

        tds.each((i, e) => {
          if (columns[i]) { journal[columns[i]] = $(e).text(); }
        });

        if (journal.print_identifier) {
          let match = /(([a-z0-9\-]+)\s*([a-z0-9\-]+))/i.exec(journal.print_identifier);
          if (match) {
            journal.print_identifier  = match[1];
            journal.online_identifier = match[2];
          }
        }

        if (!journal.title_url || !journal.print_identifier) { return; }

        journal.title_id = URL.parse(journal.title_url).host;
        journal['pkb-piddomain'] = journal.title_id;

        return pkb.addRow(journal);
      }

      // if the first cell contains "journal title", it's the header row
      if (tds.first().text().toLowerCase().includes('journal title')) {
        columns = [];
        tds.each((i, e) => {
          switch($(e).text().toLowerCase()) {
          case 'journal title':
            columns.push('publication_title');
            break;
          case 'publisher':
            columns.push('publisher_name');
            break;
          case 'print issn (online issn)':
            columns.push('print_identifier');
            break;
          case 'url':
            columns.push('title_url');
            break;
          default:
            columns.push(null);
          }
        });
      }
    });

    callback();
  });
}
