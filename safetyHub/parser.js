#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Safety Hub
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

  if ((match = /^\/$/i.exec(path)) !== null) {
    // https://tafeqld.safetyhub.com/?searchKeywords=compressed+air&region=au
    // https://tafeqld.safetyhub.com/?searchKeywords=atomic+waste&region=au
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/category\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://tafeqld.safetyhub.com/category/en-hazenv/?region=au#
    // https://tafeqld.safetyhub.com/category/cvdm/?region=au
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  }

  return result;
});
