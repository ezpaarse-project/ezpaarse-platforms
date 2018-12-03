#!/usr/bin/env node
'use strict';

const Parser = require('../.lib/parser.js');
const doiPrefix = '10.4000';

/**
 * Recognizes the accesses to the platform OpenEdition Journals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result   = {};
  const path     = parsedUrl.pathname;
  const param    = parsedUrl.query || {};
  const fileSize = parseInt(ec.size, 10);
  let match;

  // URLs with "format=..." are just partial pages
  if (param.format) {
    return result;
  }

  if ((match = /^\/([a-z-]+)\/(epub|pdf)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://books.openedition.org/pum/epub/6903

    result.mime     = match[2].toUpperCase();
    result.title_id = `${match[1]}/${match[3]}`;
    result.unitid   = `${match[1]}/${match[3]}`;
    result.doi      = `${doiPrefix}/books.${match[1]}.${match[3]}`;

    // if the size is greater than 1mo, we assume it's a full book
    result.rtype = (!fileSize || fileSize > 1000000) ? 'BOOK' : 'BOOK_SECTION';

  } else if ((match = /^\/(([a-z-]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // http://books.openedition.org/pum/6903

    // if the size is less than 10ko, it's unlikely to be an article
    if (!fileSize || fileSize > 10000) {
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'HTML';
      result.title_id = match[1];
      result.unitid   = match[1];
      result.doi      = `${doiPrefix}/books.${match[2]}.${match[3]}`;
    }
  }

  return result;
});
