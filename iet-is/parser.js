#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IET InspectDirect
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/(private|Private)\/CurrentRecord.aspx$/.exec(path)) !== null) {
    // https://inspecdirect-service.theiet.org/private/CurrentRecord.aspx?RecordId=20163016209874
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.RecordId;
  }

  return result;
});
