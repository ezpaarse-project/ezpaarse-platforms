#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Streamglish
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

  if ((match = /^\/api\/lessons\/([0-9]+)(\/[0-9]+)?$/i.exec(path)) !== null) {
    // https://api.streamglish.com/api/lessons/4
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/api\/placementtest\/list\/([0-9]+)$/i.exec(path)) !== null) {
    // https://api.streamglish.com/api/placementtest/list/1
    result.rtype    = 'EXERCISE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/api\/videos\/([0-9]+)\/player$/i.exec(path)) !== null) {
    // https://api.streamglish.com/api/videos/3150/player
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  }

  return result;
});
