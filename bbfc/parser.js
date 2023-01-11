#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bloomsbury Fashion Central
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

  if (/^\/encyclopedia-chapter$/i.test(path)) {
    // https://www.bloomsburyfashioncentral.com/encyclopedia-chapter?docid=b-9781847888563&tocid=b-9781847888563-EDch7017&st=wool
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = param.docid;
  } else if (/^\/(business-case|article)$/i.test(path)) {
    // https://www.bloomsburyfashioncentral.com/business-case?docid=b-9781350934955&tocid=b-9781350934955-002&st=wool
    // https://www.bloomsburyfashioncentral.com/article?docid=b-9781350934429&tocid=b-9781350934429-FPA388&st=wool
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.docid;
  } else if (/^\/video$/i.test(path)) {
    // https://www.bloomsburyfashioncentral.com/video?docid=BFVA_6012460235001&tocid=BFVA_file_6012460235001&st=cotton
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid   = param.docid;
  } else if (/^\/search-results$/i.test(path)) {
    // https://www.bloomsburyfashioncentral.com/search-results?any=wool
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
