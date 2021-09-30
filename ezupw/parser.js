#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform API Unpaywall - ezUnpaywall
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

  let match;

  if ((match = /^\/graphql$/i.exec(path)) !== null) {
    // http://unpaywall.inist.fr/graphql?
    result.rtype    = 'QUERY';
    result.mime     = 'JSON';
    result.title_id = match[1];

    if (param.sid) {
      result.sid = param.sid;
    }

  }

  return result;
});
