#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Hispanic American Periodicals
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

  if ((match = /^\/article\/citation\/([0-9]+)$/i.exec(path)) !== null) {
    // https://hapi.ucla.edu/article/citation/378232
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/article\/frame\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://hapi.ucla.edu/article/frame/378288/1315
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if (/^\/search\/advanced$/i.test(path)) {
    // https://hapi.ucla.edu/search/advanced
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
