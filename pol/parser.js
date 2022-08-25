#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Politico
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

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://subscriber.politicopro.com/search?q=bitcoin
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/article\/[0-9]{4}\/[0-9]{2}\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://subscriber.politicopro.com/article/2021/07/crypto-based-shadow-financial-market-spooks-regulators-2066812
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/f\/$/i.exec(path)) !== null) {
    // https://subscriber.politicopro.com/f/?id=0000017a-e3ea-d17c-ad7e-e7ea52040000
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'PDF';
    result.unitid   = param.id;
  }

  return result;
});
