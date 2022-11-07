#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Cab Direct
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

  if (/^\/cabdirect\/search\/$/i.test(path)) {
    // https://www.cabdirect.org/cabdirect/search/?q=Brain
    // https://www.cabdirect.org/cabdirect/search/?q=do%3a%22Zhongguo%20Weishengtaxixue%20Zazhi%20%2F%20Chinese%20Journal%20of%20Microecology%22
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/cabdirect\/FullTextPDF\/([0-9]+)\/([0-9]+)\.PDF$/i.exec(path)) !== null) {
    // https://www.cabdirect.org/cabdirect/FullTextPDF/2022/20220157058.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[2];
  } else if ((match = /^\/cabdirect\/abstract\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.cabdirect.org/cabdirect/abstract/20220294881?q=(Brain)
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
