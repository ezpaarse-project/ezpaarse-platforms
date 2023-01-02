#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Fulcrum
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

  let match;

  if ((match = /^\/epubs_download_interval\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/epubs_download_interval/9880vr686?chapter_index=6&locale=en&title=3.+Forward+Panic+%28page+83%29
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid = param.title;

  } else if ((match = /^\/epubs\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/epubs/9880vr686?locale=en#/6/2[xhtml00000001]!/4/4/1:0
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z]+\/monographs\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/concern/monographs/w6634416r?locale=en
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/heb$/i.test(path) && param.q) {
    // https://www.fulcrum.org/heb?utf8=%E2%9C%93&q=violence
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
