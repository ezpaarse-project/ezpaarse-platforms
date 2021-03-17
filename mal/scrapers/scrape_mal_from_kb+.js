#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

'use strict';

var PkbKbp = require('../../.lib/parsXmlKb+.js');

PkbKbp.generatePkbKbp(960, 'mal', null, (row) => {
  if (row.title_url) {
    const match = /https?:\/\/[\w.-]+\/([a-z0-9]+)(?:\/([a-z0-9]+))?\/?$/i.exec(row.title_url);
    if (match) {
      if (match[2]) {
        row.title_id = match[2];
      } else if (match[1].toLowerCase() !== 'loi') {
        row.title_id = match[1];
      }
    }
  }

  return row;
});
