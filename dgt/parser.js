#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Digitalia
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/a\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.digitaliapublishing.com/a/85727
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  }

  if ((match = /^\/a\/([0-9]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.digitaliapublishing.com/a/85727/la-hendidura-de-la-roca
    // https://www.digitaliapublishing.com/a/54993/agronomia-costarricense--volumen-40--numero-1
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if (/^\/viewepub\/$/i.test(path)) {
    // https://www.digitaliapublishing.com/viewepub/?id=85727
    // https://www.digitaliapublishing.com/viewepub/?id=125550
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = param.id;
    result.unitid = param.id;
  } else if (/^\/fulltext$/i.test(path)) {
    // https://www.digitaliapublishing.com/fulltext
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
