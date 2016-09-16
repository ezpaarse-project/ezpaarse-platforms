#!/usr/bin/env node
// Generate a kbart file with the journals of Highwire
// Write the progression in stderr
// Usage : ./scrape_hw_journals_from_xsl.js

/*jslint maxlen: 180*/

'use strict';

const request = require('request');
const cheerio = require('cheerio');
const URL     = require('url');

const PkbRows = require('../../.lib/pkbrows.js');
const pkb     = new PkbRows('hw');

pkb.setKbartName();


console.error('Scraping GSW journals');
scrapeGSW(err => {
  if (err) { throw err; }

  console.error('Scraping Highwire AtoZ');
  scrapeAtoZ(err => {
    if (err) { throw err; }

    pkb.writeKbart();
    console.error(`Kbart file generated. Path : ${pkb.kbartFileName}`);
  });
});

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
          switch ($(e).text().toLowerCase()) {
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

function scrapeAtoZ(callback) {
  // let atozJournals = 'http://highwire.stanford.edu/lists/allsites.dtl';
  let atozJournals = 'http://highwire.stanford.edu/lists/allsites.dtl?view=by+publisher';

  request(atozJournals, (err, res, body) => {
    if (err) { return callback(err); }

    let $ = cheerio.load(body);

    let currentPublisher;

    $('#subpage_content table tr').each((index, element) => {

      let publisherNode = $(element).find('td[align="LEFT"] > strong > font');

      if (publisherNode.length) {
        return currentPublisher = publisherNode.text();
      }

      let journalNode = $(element).find('td:nth-child(2) > a[href]');

      if (journalNode.length !== 1) { return; }

      let href = journalNode.attr('href');
      if (!href) { return; }
      let hostname = URL.parse(href).host;

      if (!hostname || pkb.rowsMap.hasOwnProperty(hostname)) { return; }

      let journal = pkb.initRow({
        'title_url': href,
        'title_id': hostname,
        'publisher_name': currentPublisher,
        'pkb-piddomain': hostname,
        'publication_title': journalNode.text()
      });

      pkb.addRow(journal);
    });

    callback();
  });
}
