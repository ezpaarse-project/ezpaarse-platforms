#!/usr/bin/env node
// Generate a kbart file with the journals of Highwire
// Write the progression in stderr
// Usage : ./scrape_hw_journals_from_xsl.js

/*jslint maxlen: 180*/

'use strict';

const request = require('request');
const XLS     = require('xlsjs');
const URL     = require('url');

const PkbRows = require('../../.lib/pkbrows.js');
const pkb     = new PkbRows('hw');

pkb.setKbartName();

let fileUrl = 'http://highwire.stanford.edu/librarians/AtoZList.xls';

console.error(`Downloading ${fileUrl}`);

request({ url: fileUrl, encoding: null }, (err, res, body) => {
  if (err) { throw err; }
  if (res.statusCode != 200) {
    console.error(`Download failed (status = ${res.statusCode})`);
    process.exit(1);
  }

  parseXLS(body);
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
        journalInfo['pkb-piddomain'] = journalInfo.pid;
      }
    }

    pkb.addRow(journalInfo);
  });

  pkb.writeKbart();

  console.error(`Kbart file generated. Path : ${pkb.kbartFileName}`);
}
