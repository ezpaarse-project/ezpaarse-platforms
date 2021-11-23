#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MicroJuris
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

  //let match;

  if (/^\/docDetail2$/i.test(path)) {
    // http://cl.microjuris.com/docDetail2?Idx=MJCH_MJJ51494&links=ROCK
    // http://cl.microjuris.com/docDetail2?Idx=MJCH_MJJ34034&action=listdocboxis
    // http://cl.microjuris.com/docDetail2?Idx=MJCH_MJJ34034
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.Idx;

  } else if (/^\/searchs$/i.test(path)) {
    // http://cl.microjuris.com/searchs
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
