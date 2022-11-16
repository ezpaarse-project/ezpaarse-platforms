#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Arte campus
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

  if ((match = /^\/program\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /program/philosophie-inconscient
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/search\/.+$/i.exec(path)) !== null) {
    // /search/freud
    // /search/freud/thesaurus/8287/page/1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
