#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Videatives Streaming Service
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

  if ((match = /^\/assets\/([0-9]+)$/i.exec(path)) !== null) {
    // https://streaming.videatives.com/assets/545
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if (/^\/assets$/i.test(path)) {
    // https://streaming.videatives.com/assets?utf8=%E2%9C%93&q%5Bsearch%5D=book&commit=search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
