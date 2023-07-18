#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Reference USA Gov
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

  if ((match = /^\/([a-z]+)\/Detail\/Tagged\/([a-z0-9]+)(\/[0-9]+)?$/i.exec(path)) !== null) {
    // https://www.referenceusagov.com/UsBusiness/Detail/Tagged/307e1f6384a44cf19374ba73139f7899?recordId=737950879
    // https://www.referenceusagov.com/UsHistoricalBusiness/Detail/Tagged/7ad351936a6946e492070289257ce54b/2000?recordId=511092157
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.db_id = match[1];
    result.unitid = param.recordId;

  } else if ((match = /^\/([a-z]+)\/Result\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.referenceusagov.com/UsJobs/Result/ec27a8e0c5054d1aa584cbb075743fc5
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = match[1];
  }

  return result;
});
