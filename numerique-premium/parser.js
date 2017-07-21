#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/content\/([a-z]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.numeriquepremium.com/content/books/9782728801749
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = match[2];
  }

  return result;
});

