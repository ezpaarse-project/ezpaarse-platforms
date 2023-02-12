#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Rivisteweb
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

  if ((match = /^\/download\/article\/([0-9]+.[0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // https://www.rivisteweb.it/download/article/10.7390/103852
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];
    result.doi = match[1];

  } else if ((match = /^\/doi\/([0-9]+.[0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // https://www.rivisteweb.it/doi/10.7373/82132
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.doi = match[1];
  } else if ((match = /^\/rivisteweb\/searchresults$/i.exec(path)) !== null) {
    // https://www.rivisteweb.it/rivisteweb/searchresults?search_query=Simona+Salustri&search_query_defaultValue=Author%2C+Title%2C+Subtitle&search_field=journal&fields%5BsearchOption%5D%5Bkeys%5D=&fields%5BsearchOption%5D%5Bcontributors%5D=&fields%5BsearchOption%5D%5Btitle%5D=&fields%5BsearchOption%5D%5Bdoi%5D=&fields%5BsearchOption%5D%5Beditore%5D=&fields%5BsearchOption%5D%5Bargomenti%5D%5B%5D=&fields%5BsearchOption%5D%5Briviste%5D%5B%5D=&fields%5BsearchOption%5D%5BfromYear%5D=&fields%5BsearchOption%5D%5BtoYear%5D=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
