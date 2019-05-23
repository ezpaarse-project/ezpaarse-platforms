#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Future Medicine (demo)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/journal\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.futuremedicine.com/journal/ahe
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://www.futuremedicine.com/doi/10.2217/ahe.13.55
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[2];
    result.doi    = match[1];
  }

  return result;
});
