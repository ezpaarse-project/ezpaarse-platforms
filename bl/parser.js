#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Booklist
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

  if (/^\/SearchResults.aspx$/i.test(path)) {
    // https://www.booklistonline.com/SearchResults.aspx
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/([a-zA-Z0-9-]+)\/pid=([0-9]+)$/i.exec(path)) !== null) {
    // https://www.booklistonline.com/The-Kingdom-the-Power-and-the-Glory-American-Evangelicals-in-an-Age-of-Extremism-/pid=9787647
    // https://www.booklistonline.com/The-Dreamatics-/pid=9777384
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/html5\/reader\/production\/default.aspx$/i.exec(path)) !== null) {
    // https://booklist.booklistonline.com/html5/reader/production/default.aspx?pubname=&edid=537bf5f2-2220-4c21-993a-faa2cd6372e9
    // https://booklist.booklistonline.com/html5/reader/production/default.aspx?pubname=&edid=6d2991a4-9d82-4321-9c01-8a678a578755
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid = param.edid;
  }

  return result;
});
