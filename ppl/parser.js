#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Peeters Publishers Leuven
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

  if (/^\/content\.php$/i.test(path) && param.url == 'article') {
    // https://poj.peeters-leuven.be/content.php?url=article&id=3289946&journal_code=BASP
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid = param.id;
    result.title_id = param.journal_code;

  } else if (/^\/content\.php$/i.test(path)) {
    // https://poj.peeters-leuven.be/content.php?url=journal&journal_code=BASP
    // https://poj.peeters-leuven.be/content.php?url=issue&journal_code=BASP&issue=0&vol=58
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.journal_code;
    result.unitid = param.journal_code;
    if (param.url == 'issue') {
      result.vol = param.vol;
      result.issue = param.issue;
    }
  } else if (/^\/detail\.php$/i.test(path)) {
    // https://www.peeters-leuven.be/detail.php?search_key=9789042944152&series_number_str=34&lang=en
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.search_key;
    result.print_identifier = param.search_key;
  } else if (/^\/search_results\.php$/i.test(path)) {
    // https://www.peeters-leuven.be/search_results.php?lang=en&any=daoism
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
