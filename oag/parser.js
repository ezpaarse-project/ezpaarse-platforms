#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform openalexgateway
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
  //console.error(parsedUrl);

  // let match;

  if (/^\/gateway\/openalex\/works$/i.test(path)) {
    // https://openalex.inist.fr/gateway/openalex/works
    result.rtype    = 'QUERY';
    result.mime     = 'JSON';

    if (param.sid) {
      result.sid = param.sid;
    }
  }

  if (/^\/clickandread\/works$/i.test(path)) {
    // https://openalex.inist.fr/clickandread/works
    result.rtype    = 'QUERY';
    result.mime     = 'JSON';
    if (param.sid) {
      result.sid = param.sid;
    }
  }

  return result;
});
