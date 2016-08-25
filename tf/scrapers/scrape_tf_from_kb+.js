#!/usr/bin/env node
// Write on KBART file the Masterlist Collection journals PKB
// Write on stderr the progression

'use strict';
const URL    = require('url');
const pkbKbp = require('../../.lib/parsXmlKb+.js');

pkbKbp.generatePkbKbp(957, 'tf', rowModifier);

function rowModifier(row) {
  if (!row.title_url) { return row; }

  const url = URL.parse(row.title_url, true);

  if (url.query && url.query.stitle) {
    row.title_id = url.query.stitle;
  } else {
    let match = /^\/(?:loi|toc)\/([a-z0-9]+)/i.exec(url.pathname);
    if (match) { row.title_id = match[1]; }
  }

  return row;
}
