#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Accounting Association
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

  if ((match = /^\/doi\/(abs\/)?(10\.[0-9]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /doi/10.2308/acch-51736
    // /doi/abs/10.2308/accr-51762
    result.doi = `${match[2]}/${match[3]}`;
    result.unitid = match[3];
    result.rtype = match[1] ? 'ABS' : 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /^\/doi\/(pdf|full)\/(10\.[0-9]+)\/([0-9.-]+)$/i.exec(path)) !== null) {
    // /doi/pdf/10.2308/0148-4184.14.2.59
    // /doi/full/10.2308/1558-7991-36.1.169
    if (match[1] === 'pdf') result.title_id = match[3];
    result.doi = `${match[2]}/${match[3]}`;
    result.unitid = match[3];
    result.rtype = 'ARTICLE';
    result.mime = (match[1] === 'pdf') ? 'PDF' : 'HTML';
  }

  return result;
});
