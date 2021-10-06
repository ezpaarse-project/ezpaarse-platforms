#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform National Council of Teachers of English
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

  if ((match = /^\/journals\/([a-z]+)\/issues\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://library.ncte.org/journals/ccc/issues/v72-3
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
    result.vol = match[2].split('-')[0].replace('v', '');
    result.issue = match[2].split('-')[1];

  } else if ((match = /^\/journals\/([a-z]+)\/issues\/([0-9a-z-]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://library.ncte.org/journals/ccc/issues/v72-3/31162
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[3];
    result.vol = match[2].split('-')[0].replace('v', '');
    result.issue = match[2].split('-')[1];
  }

  return result;
});
