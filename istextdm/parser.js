#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Webservices Istex TDM
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  result.sid = ec.sid || param.sid || 'none';

  let match;

  if ((match = /^(\/v\d+\/.*)/i.exec(path)) !== null) {
    // /v1/is-retracted?sid=bibcnrs
    result.rtype  = 'API_JOB';
    result.unitid = match[1];
  }

  return result;
});
