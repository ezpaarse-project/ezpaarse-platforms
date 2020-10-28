#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IBIS World
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

  if ((match = /^\/search\/$/i.exec(path)) !== null) {
    // https://my.ibisworld.com/search/?q=library
    // https://my.ibisworld.com/search/?q=amusement%20park
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/[a-z]{2}\/en\/[a-z-]+\/[a-z0-9]+\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://my.ibisworld.com/us/en/iexpert-risk-specialized/od4319/iexpert-risk
    // https://my.ibisworld.com/us/en/industry-specialized/od5410/industry-performance
    // https://my.ibisworld.com/us/en/iexpert-risk-specialized/od3315/iexpert-risk
    // https://my.ibisworld.com/ca/en/business-environment-profiles/ca827/business-environment-profile
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
