#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Digital Loeb Classical Library
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

  if ((match = /^\/view\/(([A-Z0-9]+)\/(\d\d\d\d))\/volume.xml$/i.exec(path)) !== null) {
    // https://www.loebclassics.com:443/view/LCL062/2018/volume.xml
    result.rtype    = 'TOC';
    result.mime     = 'XML';
    result.title_id = match[2];
    result.publication_date = match[3];
    result.unitid   = match[2];
  } else if (/^\/(authors|browse|volumes)$/i.test(path)) {
    // https://www.loebclassics.com:443/authors
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/view\/([a-zA-Z0-9_-]+)\/(\d\d\d\d)\/pb_(.*).xml$/i.exec(path)) !== null) {
    // https://www.loebclassics.com:443/view/seneca_younger-hercules/2018/pb_LCL062.15.xml
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.publication_date = match[2];
    result.unitid   = match[3];
  } else if (/search/i.test(path)) {
    // https://www.loebclassics.com:443/search?q=homer
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
