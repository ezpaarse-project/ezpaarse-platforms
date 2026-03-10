#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform eLibro.net
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if (/^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/busqueda_avanzada$/i.test(path)) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/titulos\/([0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/([0-9]+)\/?$/i.exec(path)) !== null) {
    // e.g. https://elibro.net/es/ereader/bibliotecaudb/271086 or .../43106/
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/colecciones\/([A-Za-z0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/epub\/([0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.unitid   = match[3];

  }
  return result;
});
