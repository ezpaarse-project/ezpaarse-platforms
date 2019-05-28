#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Future Medicine
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/doi\/pdf\/(10\.[0-9]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // /doi/pdf/10.2217/ahe.13.60
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.doi = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // /doi/10.2217/ahe.13.60
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.doi = match[1];
    result.unitid = match[2];

  }

  return result;
});
