#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DCL
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

  if (/^\/ap\/naviContents\/contentsViewInit\/hitotsubashi\/([0-9]+)\/([a-z0-9]+)$/i.test(path)) {
    // https://dcl.toyokeizai.net/ap/naviContents/contentsViewInit/hitotsubashi/2021061800/20210618HTB013
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
  } else if (/^\/ap\/naviContents\/contentsViewInit\/geppou\/([0-9]+)\/([a-z0-9]+)$/i.test(path)) {
    // https://dcl.toyokeizai.net/ap/naviContents/contentsViewInit/geppou/2008040700/20080407TKB009
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  } else if (/^\/ap\/registinfo\/init\/([a-z]+)\/([0-9]+)$/i.test(path)) {
    // https://dcl.toyokeizai.net/ap/registinfo/init/gyoukai/2021082600
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/ap\/search_freeword$/i.test(path)) {
    // https://dcl.toyokeizai.net/ap/search_freeword
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
