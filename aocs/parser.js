#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Oil Chemists Society
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

  if (/^\/[a-z-]+\/methods\/methods\/search-results$/i.test(path)) {
    // https://www.aocs.org/attain-lab-services/methods/methods/search-results?method=&keywords=olive+oil
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
