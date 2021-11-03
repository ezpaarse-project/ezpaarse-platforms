#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Special Operations Medicine
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

  if ((match = /^\/Library\/articles\/[0-9]+\/(.+)\.pdf$/i.exec(path)) !== null) {
    // https://www.jsomonline.org/Library/articles/2101/20211102Cordier.pdf?utm_source=LibraryIP&utm_medium=website&utm_campaign=University+College+Cork
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/Library\/Flipbook\/[a-z]+\/[a-z]+\/index\.html$/i.exec(path)) !== null) {
    // https://www.jsomonline.org/Library/Flipbook/ARFR/mobile/index.html
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/TOC\/([0-9a-z]+)\.php$/i.exec(path)) !== null) {
    // https://www.jsomonline.org/TOC/2101JSOMTOC.php
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
