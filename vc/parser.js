#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Vidal Consult
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

  if (/^\/search\/?([a-zA-Z0-9]+)?$/i.test(path)) {
    // https://cl.vidal-consult.com/search/product?id=1137063&edm=false
    // https://cl.vidal-consult-com/search/ingredient?id=24446
    // https://cl.vidal-consult.com/search/ingredient?id=22980
    // https://cl.vidal-consult.com/search/product?id=1392972&edm=false
    // https://mx.vidal-consult.com/search?term=Sangre
    // https://mx.vidal-consult.com/search?term=Madre
    // https://mx.vidal-consult.com/search/ingredient?id=23313
    // https://mx.vidal-consult.com/search/ingredient?id=22980
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/html_docs\/mx\/FICHAS_CLASES_ATC\/([a-zA-Z0-9]+).html$/i.exec(path)) !== null) {
    // https://mx.vidal-consult.com/html_docs/mx/FICHAS_CLASES_ATC/B01AB11.html
    // https://mx.vidal-consult.com/html_docs/mx/FICHAS_CLASES_ATC/B01AA03.html
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
