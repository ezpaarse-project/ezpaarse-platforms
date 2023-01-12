#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Omekas
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/s\/([a-z]+)\/item\/([0-9]+)\/mirador$/i.exec(path)) !== null) {
    // /s/bjc/item/6181/mirador
    result.mime = 'HTML';
    result.unitid = `${match[1]}-${match[2]}`;
    result.db_id = match[1];
  } else if ((match = /^\/s\/([a-z]+)\/searchAll$/i.exec(path)) !== null) {
    // /s/bjc/searchAll?q=grotte
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
    result.db_id = match[1];
  } else if ((match = /^\/files\/original\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // /files/original/d1d9e6f1085bc29e93cf95320e144f4f2f985dd9.pdf
    result.rtype = 'RECORD_VIEW';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/s\/([a-z]+)\/item\/([0-9]+)$/i.exec(path)) !== null) {
    // /s/bjc/item/6181
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = `${match[1]}-${match[2]}`;
    result.db_id = match[1];
  }



  return result;
});
