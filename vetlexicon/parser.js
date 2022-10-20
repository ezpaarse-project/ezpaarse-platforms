#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Vetlexicon
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

  if ((match = /^\/treat\/([a-z]+)\/([a-z-]+)\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.vetlexicon.com/treat/canis/breeds-pages/anatolian-shepherd-dog
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1] + '-' + match[2]+ '-' + match[3];

  } else if (/^\/treat\/search\.aspx$/i.test(path)) {
    // https://www.vetlexicon.com/treat/search.aspx?searchtext=dog&searchmode=anyword
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
