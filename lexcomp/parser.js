#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lexicomp
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

  if (/^\/lco\/action\/doc\/retrieve\/docid\/patch_f\/([0-9]+)$/i.test(path)) {
    // http://online.lexi.com/lco/action/doc/retrieve/docid/patch_f/6292?cesid=0JCQpOh9bjp&searchUrl=%2Flco%2Faction%2Fsearch%3Fq%3Dalbuterol%26t%3Dname%26va%3Dalbuterol#goilist-ext
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  } else if (/^\/lco\/action\/search$/i.test(path)) {
    // http://online.lexi.com/lco/action/search?q=albuterol&t=name&va=albuterol
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
