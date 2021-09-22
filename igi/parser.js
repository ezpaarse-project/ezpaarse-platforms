#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IGI Global
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

  if ((match = /^\/gateway\/search\/$/i.exec(path)) !== null) {
    // https://www.igi-global.com/gateway/search/?p=science
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/gateway\/article\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.igi-global.com/gateway/article/117431?ct=-8585694425882740671
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/gateway\/article\/full-text-html\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.igi-global.com/gateway/article/full-text-html/117431
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/gateway\/article\/full-text-pdf\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.igi-global.com/gateway/article/full-text-pdf/117431
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
