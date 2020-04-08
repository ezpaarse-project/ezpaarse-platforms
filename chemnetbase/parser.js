#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform HEMnetBASE Chemical Databases Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if (/^\/([a-zA-Z0-9/]+)Results.xhtml$/i.test(path)) {
    // http://www.chemnetbase.com:80/faces/search/SearchResults.xhtml
    // http://hbcponline.com:80/faces/contents/ContentsResults.xhtml
    // http://ccd.chemnetbase.com:80/faces/chemical/ChemicalSearchResults.xhtml
    // http://poly.chemnetbase.com:80/faces/polymers/PolymerSearchResults.xhtml
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/faces\/documents\/([a-zA-Z0-9-_/)]+).xhtml$/i.exec(path)) !== null) {
    // http://hbcponline.com:80/faces/documents/04_02/04_02_0137.xhtml
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/PDFarchive\/([a-zA-Z0-9-_/)]+).pdf$/i.exec(path)) !== null) {
    // http://hbcponline.com:80/PDFarchive/099/HCP-99-06-13.pdf?pfdrid_c=true
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  }

  return result;
});
