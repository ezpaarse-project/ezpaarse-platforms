#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

'use strict';

var PkbKbp = require('../../.lib/parsXmlKb+.js');

PkbKbp.generatePkbKbp(391, 'brill', null, (row) => {
  if (row.title_url) {
    const match = /\/journals\/([a-z]+)\//i.exec(row.title_url);
    if (match) { row.title_id = match[1]; }
  }

  return row;
});
