#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Orthopaedic & Sports Physical Therapy
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

  if ((match = /^\/doi\/pdf\/(10\.[0-9]+\/([a-z0-9.]+))/i.exec(path)) !== null) {
    // https://www.jospt.org/doi/pdf/10.2519/jospt.2021.0109
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.unitid = match[2];
    result.doi = match[1];

  } else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z0-9.]+))/i.exec(path)) !== null) {
    // https://www.jospt.org/doi/10.2519/jospt.2021.0109
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.doi = match[1];
  } else if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://www.jospt.org/action/doSearch?AllField=pain
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
