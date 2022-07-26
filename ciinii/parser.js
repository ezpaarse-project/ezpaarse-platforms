#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CiiNii
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

  if (/^\/ncid\/([a-z0-9]+)$/i.test(path)) {
    // https://ci.nii.ac.jp/ncid/BC14188705?l=en
    result.rtype    = 'METADATA';
    result.mime     = 'HTML';
  } else if (/^\/all$/i.test(path)) {
    // https://cir.nii.ac.jp/all?q=marketing
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
