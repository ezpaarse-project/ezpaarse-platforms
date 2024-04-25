#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scite
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

  if (/^\/search$/i.test(path) && (param.q !== undefined || param.author !== undefined)) {
    // https://scite.ai/search?mode=all&q=Using%20AI%20to%20Teach%20AI
    // https://scite.ai/search?mode=all&q=Keeping%20it%20real
    // https://scite.ai/search?mode=all&author=David%20Smith
    // https://scite.ai/search?mode=all&author=John%20Edwards
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/reports\/([a-z-]+)-[a-zA-Z0-9]+$/i.exec(path)) !== null) {
    // https://scite.ai/reports/depth-dependent-microbial-communities-potentially-mediating-NlaN3YZQ?showReferences=true
    // https://scite.ai/reports/heavy-metal-pollution-in-surface-338Ovy
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
