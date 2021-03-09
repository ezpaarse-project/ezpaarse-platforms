#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Frost & Sullivan
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

  if (/^\/$/i.test(path)) {
    // https://ww2.frost.com/?ubermenu-search-cat=Within+this+site&s=Airlines&queryText=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/(.+)\/(.+)[/]$/i.test(path)) {
    // https://ww2.frost.com/news/press-releases/global-airlines-leverage-ai-machine-learning-and-blockchain-to-save-costs-and-generate-new-revenues-says-frost-sullivan/
    // https://ww2.frost.com/frost-perspectives/alaska-airlines-shows-how-to-deliver-excellent-cxs/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }

  return result;
});
