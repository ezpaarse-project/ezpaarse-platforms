#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Elsevier Elibrary
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/product\/(\D+)(\d+)$/i.exec(path)) !== null) {
    // https://www.elsevierelibrary.fr/product/ophtalmologie56685
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/epubreader\/(\D+)(\d+)$/i.exec(path)) !== null) {
    // https://www.elsevierelibrary.fr/epubreader/ophtalmologie56685
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/pdfreader\/(\D+)(\d+)$/i.exec(path)) !== null) {
    // https://www.elsevierelibrary.fr/pdfreader/hmatologie64425
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
