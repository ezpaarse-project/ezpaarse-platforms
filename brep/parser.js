#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Brepols Online
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

  if ((match = /^\/doSearch$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/action/doSearch?AllField=alexander
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/toc/aboll/2016/134/2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.publication_date = match[1];
    result.unitid   = match[2];
  }

  return result;
});
