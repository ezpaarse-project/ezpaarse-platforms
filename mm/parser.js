#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ministry Matters
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

  if (/^\/search/i.test(path)) {
    // https://www.ministrymatters.com:443/search/?t=a&q=romans
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/(library_beta|preach|teach|worship|reach|lead|bin)\/$/i.test(path)) {
    // https://www.ministrymatters.com:443/library_beta/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/[a-z]+\/entry\/([0-9].*?)\/(.*)$/i.exec(path)) !== null) {
    // https://www.ministrymatters.com:443/all/entry/4521/romans-5-basic-bible-commentary
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/reader\/([0-9]+)/i.exec(path)) !== null) {
    // https://www.ministrymatters.com:443/reader/9781426725845
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/product\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.ministrymatters.com:443/product/9781501855146
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    result.unitid   = match[1];
  }

  return result;
});
