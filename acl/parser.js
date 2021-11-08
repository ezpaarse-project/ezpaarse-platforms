#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Access Learning
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

  if (/^\/search\.cfm$/i.test(path)) {
    // https://www.accesslearning.com/search.cfm?keyword=Space
    // https://www.accesslearning.com/search.cfm?keyword=space&subjects=T-683&cats=T-683&grades=&producer=&atype=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = param.subjects;
    result.search_term = param.keyword;

  } else if (/^\/videodetail\.cfm$/i.test(path)) {
    // https://www.accesslearning.com/videodetail.cfm?asset_guid=3CDFFB36-F88B-4B57-AA32-78BE107B45F5
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid   = param.asset_guid;
  }

  return result;
});
