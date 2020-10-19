#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform FRONTIERSIN
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

  if ((match = /^\/articles\/(10\.([a-z0-9.]+)\/([a-z0-9.]+))\/?(full|epub|xml)?/i.exec(path)) !== null) {
    // /articles/10.3389/fneur.2020.00988/full
    // /articles/10.3389/fneur.2020.00988/epub
    // /articles/10.3389/fneur.2020.00988
    // /articles/10.3389/fneur.2020.00988/xml/nlm

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (match[4] === 'epub' || match[4] === 'xml') {
      result.mime = match[4].toUpperCase();
    }
    if (match[4] === 'full') {
      result.mime = 'HTML';
    }
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // /search?query=brain&tab=top-results&origin=https%3A%2F%2Fwww.frontiersin.org%2Farticles

    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
