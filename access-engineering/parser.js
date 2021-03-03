#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Access Engineering
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

  if (/^\/search$/i.test(path)) {
    // https://www.accessengineeringlibrary.com/search?query=Fracking&items_per_page=25&scope=selection
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/content\/book\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.accessengineeringlibrary.com/content/book/9781259585616
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/content\/book\/([0-9]+)\/toc-chapter\/([a-z0-9]+)\/section\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.accessengineeringlibrary.com/content/book/9781259585616/toc-chapter/chapter3/section/section2
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1] + '_' + match[2] + '_' + match[3];
  } else if ((match = /^\/content\/video\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.accessengineeringlibrary.com/content/video/V4199176154001
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/content\/([a-z0-9]+)\/([a-z0-9_]+)$/i.test(path)) {
    // https://www.accessengineeringlibrary.com/content/calculator/S0022_Liquid_Liquid_Extraction_Solvent_Screening
    result.rtype    = 'SUPPL';
  } else if (/^\/datavis\/([a-z-]+)$/i.test(path)) {
    // https://www.accessengineeringlibrary.com/datavis/material-properties#/
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
  }

  return result;
});
