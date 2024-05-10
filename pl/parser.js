#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Peter Lang
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/document\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.peterlang.com/document/1111518
    // https://www.peterlang.com/document/1093722
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if (/^\/free_download$/i.test(path) && param.document_id !== undefined) {
    // https://www.peterlang.com/free_download?document_id=1067645&product_form=EBOOK&publication_type=pdf
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = param.document_id;

  } else if (/^\/search$/i.test(path)) {
    // https://www.peterlang.com/search?searchstring=constitution
    // https://www.peterlang.com/search?q1=Science&searchBtn=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
