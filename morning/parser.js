#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Morningstar Investment Research Center
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

  if ((match = /^\/ArticleSuppot\/article$/i.exec(path)) !== null) {
    // http://library.morningstar.com/ArticleSuppot/article?id=1016715
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.id;

  } else if ((match = /^\/videos\/$/i.exec(path)) !== null) {
    // http://library.morningstar.com/videos/?id=1017223
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = param.id;
  } else if ((match = /^\/v2\/quote$/i.exec(path)) !== null) {
    // http://library.morningstar.com/v2/quote?id=0P0001KOSA&typeid=ST
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if ((match = /^\/Returns\/([0-9a-z]+.html)$/i.exec(path)) !== null) {
    // http://library.morningstar.com/Returns/CategoryReturns.html
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  } else if ((match = /^\/Returns\/([0-9a-z_]+).pdf$/i.exec(path)) !== null) {
    // http://library.morningstar.com/Returns/Consumer_Cyclical_Q4_2020.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
