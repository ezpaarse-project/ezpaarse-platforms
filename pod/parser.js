#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Oxford Dictionaries
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

  if (/^(\/[a-z]{2})?\/definition\/([a-z_-]+)\/([a-z]+)$/i.test(path)) {
    // https://premium.oxforddictionaries.com/us/definition/american_english/lit
    // https://premium.oxforddictionaries.com/us/definition/american_english-thesaurus/good
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';

  } else if (/^(\/[a-z]{2})?\/search\/$/i.test(path)) {
    // https://premium.oxforddictionaries.com/us/search/?multi=1&dictCode=american_english&dict=american_english&q=fire
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }  else if ((match = /^(\/[a-z]{2})?\/translate\/([a-z-/]+)$/i.exec(path)) !== null) {
    // /translate/english-arabic/garden
    result.rtype    = 'QUERY';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  }

  return result;
});
