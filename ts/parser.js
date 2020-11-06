#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tech Street
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

  if ((match = /^\/searches\/([0-9]+)$/i.exec(path)) !== null) {
    // https://subscriptions.techstreet.com/searches/10073446?per_page=10
    // https://subscriptions.techstreet.com/searches/10073519
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/downloads\/create\/[0-9]+\/([0-9a-z-_]+)\.pdf$/i.exec(path)) !== null) {
    // https://subscriptions.techstreet.com/downloads/create/749445/B36-19M_2018.pdf?source=
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/products\/preview\/([0-9]+)$/i.exec(path)) !== null) {
    // https://subscriptions.techstreet.com/products/preview/790358
    result.rtype    = 'PREVIEW';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/products\/([0-9]+)$/i.exec(path)) !== null) {
    // https://subscriptions.techstreet.com/products/790358#
    // https://subscriptions.techstreet.com/products/711432
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
