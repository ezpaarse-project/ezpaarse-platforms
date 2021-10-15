#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lyell Collection
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

  if ((match = /^\/content\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\.full\.pdf$/i.exec(path)) !== null) {
    // https://jm.lyellcollection.org/content/jmpaleo/36/2/153.full.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.first_page = match[4];

  } else if ((match = /^\/content\/([0-9]+)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://jm.lyellcollection.org/content/36/2/153
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.vol = match[1];
    result.issue = match[2];
    result.first_page = match[3];
  } else if (/^\/search\/(.+)$/i.test(path)) {
    // https://www.lyellcollection.org/search/rocks%20jcode%3Ageochem%7C%7Cegsp%7C%7Cmemoirs%7C%7Cspecpubgsl%7C%7Cjgs%7C%7Cjgsleg%7C%7Cjmpaleo%7C%7Cpgc%7C%7Cpetgeo%7C%7Cpygs%7C%7Cqjegh%7C%7Csjg%7C%7Ctransed%7C%7Ctransglas%7C%7Ctransgsl
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
