#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Australian Medicines Handbook
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

  if ((match = /^\/chapters\/[a-z-]+\/[a-z-]+\/[a-z-]+\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://amhonline.amh.net.au/chapters/blood-electrolytes/anticoagulants/heparins/danaparoid
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/search$/i.test(path)) {
    // https://amhonline.amh.net/search?q=heparins
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
