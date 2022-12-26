#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NII-REO
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

  if ((match = /^\/hss\/([0-9]+)\/fulltext\/ja$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/hss/2000000000215788/fulltext/ja
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/hss\/([0-9]+)\/ja$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/hss/2200000000667829/ja
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/hss\/searchresult$/i.test(path)) {
    // https://reo.nii.ac.jp/hss/searchresult
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
