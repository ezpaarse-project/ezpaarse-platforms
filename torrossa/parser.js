#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Torrossa
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/[a-z]{2}\/search\/([a-zA-z0-9%]+)?$/i.test(path)) {
    // /en/search/Java
    // /en/search/Computer%20Science
    // /it/search/Virus
    // /it/search/marins
    // /it/search/?q=Einstein
    // /it/search/Voltare
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/[a-z]{2}\/resources\/an\/([0-9]+)$/i.exec(path)) !== null) {
    // /en/resources/an/2236975
    // /it/resources/an/2236976
    // /it/resources/an/2193689?qt=any_keyword_search&q=Voltare&rows=50&sort=score+desc%2C+pub_date+desc%2C+title_sort+desc&start=0&page=0&publisher_code=FM0520&type=Search&itemnumber=1&rows_original=50&uri_original=%2Fit%2Fsearch%2FVoltare#
    // /it/resources/an/2193653?qt=any_keyword_search&q=Voltare&rows=100&sort=score+desc%2C+pub_date+desc%2C+title_sort+desc&start=100&page=1&publisher_code=FM0520&type=Search&itemnumber=77&rows_original=100&uri_original=%2Fit%2Fsearch%2F#
    result.rtype = 'ARTICLE';
    if (param.qt) result.mime = 'HTML';
    else result.mime = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/[a-z]{2}\/catalog\/download\/([0-9]+)$/i.exec(path)) !== null) {
    // /it/catalog/download/5453152
    // /it/catalog/download/5592583
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/[a-z]{2}\/catalog\/(preview|readonline)\/([0-9]+)$/i.exec(path)) !== null) {
    // /it/catalog/preview/5453152
    // /it/catalog/preview/5592583
    // /it/catalog/readonline/5462110
    // /it/catalog/readonline/5363707
    // /it/catalog/readonline/2200664
    // /it/catalog/readonline/2985059
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.unitid = match[2];
  } else if ((match = /^\/orders\/review\/([0-9]+)$/i.exec(path)) !== null) {
    // /orders/review/2200664
    // /orders/review/2985059
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/digital\/doc\/([0-9]+)_[a-z0-9.]+$/i.exec(path)) !== null) {
    // /digital/doc/4443854_ab7000e724a.pdf
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.title_id = match[1];
  }

  return result;
});
