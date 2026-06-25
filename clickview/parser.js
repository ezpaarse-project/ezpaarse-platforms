#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform clickview
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // use console.error for debuging
  // console.error(parsedUrl);

  if ((match = /^\/middle\/topics\/([^/]+)\/([^/]+)$/.exec(path)) !== null) {
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = `${match[1]}/${match[2]}`;
  } else if ((match = /^\/middle\/videos\/([0-9]+)\/([^/]+)$/.exec(path)) !== null) {
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = `${match[1]}/${match[2]}`;
  } else if (path === '/search' && param.query) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
