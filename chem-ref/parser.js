#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chem Reference
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

  if (/^\/searchmain\.php$/i.test(path)) {
    // https://www-chem-reference.com/searchmain.php
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/viewpdf\/view2\.php$/i.test(path)) {
    // https://www-chem-reference.com/viewpdf/view2.php?out=2&DIV=2&CHAPTER=2-11&PAGE=272
    result.rtype    = 'BOOK_PAGE';
    result.mime     = 'PDF';
  } else if (/^\/viewkiso\.php$/i.test(path)) {
    // https://www-chem-reference.com/viewkiso.php?ID=T080074
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';
    result.unitid   = param.ID;
  }

  return result;
});
