#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mediathèque Numérique
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/products$/i.test(path)) {
    // /products
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/api\/proxy\/api\/user\/createTransaction$/i.test(path)) {
    // /api/proxy/api/user/createTransaction?productUuid=3a9f619d-5b95-11ed-bb83-d2b43dac3155
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    if (param.productUuid) {
      result.unitid = param.productUuid;
    }
  } else if ((match = /^\/films\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /films/il-buco
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];

  }

  return result;
});
