#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform WGSN
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

  if ((match = /^\/content\/personalized\/reports$/i.exec(path)) !== null) {
    if (param.query) {
      // https://www.wgsn.com/content/personalized/reports?query=shoes
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    } else {
      // https://www.wgsn.com/content/personalized/reports?categories=18&markets=12
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/content\/board_viewer\/#\/([0-9]+)\/page\/[0-9]+$/i.exec(path + parsedUrl.hash)) !== null) {
    // https://www.wgsn.com/content/board_viewer/#/88368/page/7
    // https://www.wgsn.com/content/board_viewer/#/63286/page/1
    // https://www.wgsn.com/content/board_viewer/#/88749/page/1
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
