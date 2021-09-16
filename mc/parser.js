#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Medicines Complete
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  // let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  let hash = parsedUrl.hash.replace(/#/g, '').replace(/\?.+/g, '');

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/search\/all\/(.+)$/i.exec(hash)) !== null) {
    // https://www.medicinescomplete.com/#/search/all/Pain?offset=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/content\/([a-z]+)\/([0-9_]+)$/i.exec(hash)) !== null) {
    // https://www.medicinescomplete.com/#/content/bnfc/_359175838?hspl=pain
    // https://www.medicinescomplete.com/#/content/excipients/231446?hspl=pain
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
