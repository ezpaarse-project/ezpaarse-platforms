#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nomos eLibrary
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

  if ((match = /^\/((10.[0-9]+)\/([0-9]+))\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /10.5771/9783748905509/glaeubiger-ohne-risiko
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.doi = match[1];
    result.unitid = match[3];
  } else if ((match = /^\/((10.[0-9]+)\/([0-9]+)).pdf$/i.exec(path)) !== null) {
    // /10.5771/9783748905509.pdf
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.doi = match[1];
    result.unitid = match[3];
  }

  return result;
});
