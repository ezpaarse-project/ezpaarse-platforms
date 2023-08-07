#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Benjamins
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/online\/([a-z]+)\/publications\/([0-9]+)$/i.exec(path)) !== null) {
    // https://benjamins.com/online/etsb/publications/52963
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.db_id = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/online\/([a-z]+)\/articles\/([a-z0-9]+)?(\.[a-z]+)?$/i.exec(path)) !== null) {
    // https://www.benjamins.com/online/hts/articles/ada1
    // https://benjamins.com/online/hts/articles/hyb1.fr
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.db_id = match[1];
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/online\/([a-z]+)\/search$/i.exec(path)) !== null) {
    // https://www.benjamins.com/online/hts/search?r=all&q=Adaption
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
    result.db_id = match[1];
  }

  return result;
});
