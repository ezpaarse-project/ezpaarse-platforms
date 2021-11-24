#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Natural Medicines
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

  if ((match = /^\/tools\/([0-9a-z-]+)\.aspx$/i.exec(path)) !== null) {
    // https://naturalmedicines.therapeuticresearch.com/tools/pregnancy-lactation-checker.aspx#N
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/databases\/([a-z-,]+)\/([a-z]+)\.aspx$/i.exec(path)) !== null) {
    // https://naturalmedicines.therapeuticresearch.com/databases/food,-herbs-supplements/patienthandout.aspx?productid=607&lang=en
    // https://naturalmedicines.therapeuticresearch.com/databases/health-wellness/professional.aspx?productid=1219
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.db_id = match[1];
    result.unitid   = param.productid;
  } else if ((match = /^\/search\.aspx$/i.exec(path)) !== null) {
    // https://naturalmedicines.therapeuticresearch.com/search.aspx?q=aloe&go.x=0&go.y=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
