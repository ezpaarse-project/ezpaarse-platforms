#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform EZMovie
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

  if ((match = /^\/films\/movie\/play\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.ezmovie.tw/films/movie/play/5fcf11bc38e72
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/films\/info\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.ezmovie.tw/films/info/5fcf11bc38e72
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/search\/(.+)$/i.test(path)) {
    // https://www.ezmovie.tw/search/冰雪奇緣
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
