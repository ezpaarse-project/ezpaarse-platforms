#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The Business Journals
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

  if ((match = /^\/(bizjournals|newyork)\/news\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/([a-z0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://www.bizjournals.com/newyork/news/2021/07/24/rental-car-shortage-labor-semiconductor-shipping.html
    // https://www.bizjournals.com/bizjournals/news/2021/07/26/covid-19-shortage-suply-chain.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/bizjournals\/search\/results$/i.exec(path)) !== null) {
    // https://www.bizjournals.com/bizjournals/search/results?q=Bitcoin&search__button=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  }

  return result;
});
