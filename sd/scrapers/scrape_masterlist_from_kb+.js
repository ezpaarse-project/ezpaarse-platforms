#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

'use strict';

var PkbKbp = require('../../.lib/parsXmlKb+.js');

PkbKbp.generatePkbKbp(512, 'sd', null, (row) => {
  if (row.title_url) {
    const match = /\/(bookseries|journal)\/([0-9x]+)$/i.exec(row.title_url);
    if (match) { row.title_id = match[2]; }
  }

  return row;
});
