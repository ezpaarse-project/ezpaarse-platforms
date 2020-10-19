#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MEDRXIV
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

  if ((match = /^\/content\/(10\.[0-9]+\/([0-9.]+))v[0-9]+(\.full.pdf)?$/i.exec(path)) !== null) {
    // /content/10.1101/2020.09.24.20197293v2.full.pdf
    // /content/10.1101/2020.09.24.20197293v2

    result.rtype    = 'ARTICLE';
    result.mime     = match[3] ? 'PDF' : 'HTML';
    result.unitid   = match[2];
    result.doi      = match[1];
  } else if ((match = /^\/(collection|search)\/([\w-_]+)$/i.exec(path)) !== null) {
    // /search/covid
    // /collection/addiction-medicine

    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (match[1].toLocaleLowerCase() === 'collection') {
      result.unitid = match[2];
    }
  }

  return result;
});
