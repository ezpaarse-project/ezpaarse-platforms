#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Black and White Movies
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

  if ((match = /^\/([a-z]+)\.html$/i.exec(path)) !== null) {
    // https://bnwmovies.com/metropolis.html
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if (/^\/$/i.test(path)) {
    // https://bnwmovies.com/?s=the+day+the+earth+stood+still
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
