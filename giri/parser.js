#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Giri Repbase
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);


  if (/^\/repbase\/update\/search.php$/i.test(path)) {
    // /repbase/update/search.php?query=genome&querytype=Titles
    // /repbase/update/search.php?query=genome&querytype=Authors
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
