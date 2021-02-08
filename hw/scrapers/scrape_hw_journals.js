#!/usr/bin/env node
// Generate a kbart file with the journals of Highwire
// Write the progression in stderr
// Usage : ./scrape_hw_journals_from_xsl.js

'use strict';

const { lib } = require('../../.lib/utils.js');
const URL     = lib('url');
const path    = lib('path');
const request = lib('request');
const cheerio = lib('cheerio');
const KBart   = lib('./kbart');

const kbart = new KBart({
  directory: path.resolve(__dirname, '../pkb'),
  provider: 'hw'
});

console.error('Scraping Highwire AtoZ');
let atozJournals = 'http://portal.highwire.org/lists/allsites.dtl?view=by+publisher';

request(atozJournals, (err, res, body) => {
  if (err) {
    if (err) {
      console.error(`Could not load ${atozJournals}`);
      process.exit(1);
    }
  }

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

    const result = kbart.add({
      'title_url': href,
      'title_id': hostname,
      'publisher_name': currentPublisher,
      'pkb-piddomain': hostname,
      'publication_title': journalNode.text()
    });

    if (result instanceof Error) {
      console.error(`Error: ${result}`);
    }
  });

  kbart.save().then(() => kbart.summarize());
});
