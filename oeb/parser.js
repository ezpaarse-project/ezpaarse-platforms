#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for oeb platform
 * http://analogist.couperin.org/platforms/oeb/
 */
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var match;

  if ((match = /^\/([a-z]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://books.openedition.org/cdf/3599
    result.title_id = match[1]; //only the title_id used for ABS is in the KBart file
    result.unitid   = match[1];
    // result.rtype    = 'ABS' || 'ARTICLE';
    result.mime     = 'HTML';
  } else if ((match = /^\/([a-z]+)\/pdf\/([0-9]+)$/.exec(path)) !== null) {
    // http://books.openedition.org/editionsmsh/pdf/327
    result.title_id = match[1] + '/' + match[2]; //only the title_id used for BOOK is in the KBart file
    result.unitid   = result.title_id;
    // result.rtype    = 'BOOK' || 'BOOK_SECTION;
    result.mime     = 'PDF';
  } else if ((match = /^\/([a-z]+)\/epub\/([0-9]+)$/.exec(path)) !== null) {
    // http://books.openedition.org/editionsmsh/epub/278
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = result.title_id;
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
  }
  return result;
});
