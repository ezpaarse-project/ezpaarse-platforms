#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Know BC
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

  if ((match = /^\/books\/([a-zA-Z-]+)\/([a-zA-Z-]+)\/([a-zA-Z-]+)\/([a-zA-Z-]+)(?:\/([a-zA-Z0-9-]+))?$/i.exec(path)) !== null) {
    // https://www.knowbc.com/books/Marine-Life-of-the-Pacific-Northwest/Invertebrates/Molluscs/Octopuses-and-Squids/MC371-GIANT-PACIFIC-OCTOPUS
    // https://www.knowbc.com/books/Field-Guides/Wildlife-of-the-Rockies/Birds/Spruce-Grouse
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'HTML';
    let filteredMatch = match.filter(x => x !== undefined);
    result.unitid   = filteredMatch.pop();
    if (filteredMatch.length > 4) {
      result.title_id = filteredMatch[1];
    } else {
      result.title_id = filteredMatch[2];
    }
  } else if ((match = /^\/books\/([a-z-]+)\/(Chapter-([0-9]+)-([a-z-]+))$/i.exec(path)) !== null) {
    // https://www.knowbc.com/books/Pacific-Seaweeds/Chapter-1-About-Seaweeds
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.title_id = match[1];

  } else if ((match = /^\/books\/([a-zA-Z-]+)\/([a-zA-Z-]+)(:?\/([a-zA-Z-]+))?$/i.exec(path)) !== null) {
    // https://www.knowbc.com/books/Encyclopedia-of-BC/A
    // https://www.knowbc.com/books/Field-Guides/Wildlife-of-the-Rockies/Birds
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    let filteredMatch = match.filter(x => x !== undefined);
    result.unitid   = filteredMatch.pop();
    if (filteredMatch.length > 2) {
      result.title_id = match[2];
    }
  } else if (/^\/content\/search$/i.test(path)) {
    // https://www.knowbc.com/content/search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
