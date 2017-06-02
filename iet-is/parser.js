#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IET InspectDirect
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param  = parsedUrl.query || {};

  if (/^\/(private|Private)\/CurrentRecord.aspx$/.test(path)) {
    // https://inspecdirect-service.theiet.org/private/CurrentRecord.aspx?RecordId=20163016209874
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = param.RecordId;
  }

  return result;
});
