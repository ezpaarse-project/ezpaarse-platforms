#!/usr/bin/env node
'use strict';

const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OpenEdition Journals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result       = {};
  const path         = parsedUrl.pathname;
  const host         = parsedUrl.hostname || '';
  const fileSize     = parseInt(ec.size, 10);
  const bookPlatform = host.includes('books');
  let match;


  if ((match = /^(\/[a-z-]+)?\/(epub|pdf)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://socio.revues.org/pdf/1882
    // http://journals.openedition.org/crau/pdf/370
    // http://books.openedition.org/pum/epub/6903

    result.mime     = match[2].toUpperCase();
    result.title_id = match[1] ? match[1].substr(1) : host.split('.')[0];
    result.unitid   = match[3];

    if (bookPlatform) {
      // if the size is greater than 1mo, we assume it's a full book
      result.rtype = (!fileSize || fileSize > 1000000) ? 'BOOK' : 'BOOK_SECTION';
    } else {
      result.rtype = 'ARTICLE';
    }

  } else if ((match = /^(\/[a-z-]+)?\/([0-9]+)$/i.exec(path)) !== null) {
    // http://socio.revues.org/1877
    // http://journals.openedition.org/socio/3061
    // http://books.openedition.org/pum/6903

    // if the size is less than 10ko, it's unlikely to be an article
    if (!fileSize || fileSize > 10000) {
      result.rtype    = bookPlatform ? 'BOOK_SECTION' : 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = match[2];
      result.title_id = match[1] ? match[1].substr(1) : host.split('.')[0];
    }
  }

  return result;
});

