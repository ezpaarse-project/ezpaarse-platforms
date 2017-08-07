#!/usr/bin/env node
'use strict';

const { lib } = require('../../.lib/utils');

const path    = lib('path');
const request = lib('request');
const cheerio = lib('cheerio');
const KBart   = lib('./kbart');

const kbart = new KBart({
  directory: path.resolve(__dirname, '../pkb'),
  provider: 'pe'
});

const browsePage = 'https://projecteuclid.org/browse';

request(browsePage, (err, res, body) => {
  if (err) {
    console.error(`Could not load ${browsePage}`);
    process.exit(1);
  }

  const $ = cheerio.load(body);

  $('table#browse_container > tbody > tr').each((index, element) => {
    const title    = $(element).find('td:has(".sort_title") > a').text();
    const format   = $(element).find('.format').text();
    const metadata = { publication_title: title };

    switch (format.toLowerCase()) {
    case 'journal':
    case 'proceedings':
      metadata.publication_type = 'serial';
      break;
    case 'book series':
      metadata.publication_type = 'monograph';
      break;
    }

    // Metadata is located in a toggleable list
    const infoList = $(element).find('ul.toggle li')
      // Remove new lines, tabs and big spaces for easier search
      .map((i, el) => $(el).text().trim().replace(/[\n\t]/g, '').replace(/ {2,}/g, ' '))
      .get()
      .join('\n');

    let match;

    if ((match = /^(?:includes:.+)?issn:\s*([0-9]{4}-[0-9]{4})\s*\((print|electronic)\)(?:\s*,\s*([0-9]{4}-[0-9]{4})\s*\((print|electronic)\))?/im.exec(infoList))) {
      let idType = match[2] === 'print' ? 'print_identifier' : 'online_identifier';
      metadata[idType] = match[1];

      if (match[4]) {
        idType = match[4] === 'print' ? 'print_identifier' : 'online_identifier';
        metadata[idType] = match[3];
      }
    }

    if ((match = /^euclid url:\s*(http.+\/([a-z0-9]+))$/im.exec(infoList))) {
      metadata.title_url = match[1];
      metadata.title_id  = match[2];
    }

    if ((match = /^publisher:\s*(.+)$/im.exec(infoList))) {
      metadata.publisher_name = match[1];
    }

    if ((match = /^discipline\(s\):\s*(.+)$/im.exec(infoList))) {
      metadata.discipline = match[1];
    }

    if ((match = /^access:\s*(.+)$/im.exec(infoList))) {
      switch (match[1].toLowerCase()) {
      case 'open access':
      case 'all content is open':
        metadata.access_type = 'F';
        break;
      case 'by subscription only':
        metadata.access_type = 'P';
        break;
      }
    }

    const result = kbart.add(metadata);

    if (result instanceof Error) {
      console.error(`Error: ${result}`);
    }
  });

  kbart.save().then(() => kbart.summarize());
});
