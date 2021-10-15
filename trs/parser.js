#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The Royal Society
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

  if ((match = /^\/doi\/pdf\/(.+)$/i.exec(path)) !== null) {
    // https://royalsocietypublishing.org/doi/pdf/10.1098/rsob.210053
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/doi\/(.+)$/i.exec(path)) !== null) {
    // https://royalsocietypublishing.org/doi/10.1098/rsob.210053
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi = match[1];
    result.unitid   = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://royalsocietypublishing.org/action/doSearch?AllField=rocks
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid = param.AllField;
  }

  return result;
});
