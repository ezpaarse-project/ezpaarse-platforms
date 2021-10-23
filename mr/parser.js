#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Market Research
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

  if ((match = /^\/([a-z]+)\/Search$/i.exec(path)) !== null) {
    // https://www.marketresearch.com/academic/Search?keywords=Food
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = match[1];

  } else if ((match = /^\/([a-z]+)\/Product\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.marketresearch.com/academic/Product/16178215
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.db_id = match[1];

  } else if ((match = /^\/([a-z]+)\/Product\/Download$/i.exec(path)) !== null) {
    // https://www.marketresearch.com/academic/Product/Download?id=16178215
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.id;
    result.db_id = match[1];
  }

  return result;
});
