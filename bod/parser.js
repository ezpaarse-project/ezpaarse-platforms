#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Biblioondemand
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

  if (/^\/\/Default\/search\.aspx$/i.test(path)) {
    // /Default/search.aspx
    result.rtype = 'TOC';
    result.mime = 'HTML';
  } else if (/^\/search\.aspx$/i.test(path)) {
    // /search.aspx
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
