#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Religion and Theology Abstracts
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

  if ((match = /^\/(list-of-abstractors|journals-we-abstract).php$/i.exec(path)) !== null) {
    // http://www.rtabstracts.org:80/list-of-abstractors.php
    // /journals-we-abstract.php
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if (/^\/search\/(singleresult|detailedresults).php$/i.test(path)) {
    // http://www.rtabstracts.org:80/search/singleresult.php?ac=2
    // http://www.rtabstracts.org:80/search/detailedresults.php?s=
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
  } else if (/^\/search\/results.php$/i.test(path)) {
    // http://www.rtabstracts.org:80/search/results.php?a=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
