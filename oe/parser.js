#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OrthoEvidence
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

  if ((match = /^\/[a-z]+\/[a-z]+\/([0-9]+)$/i.exec(path)) !== null) {
    // https://myorthoevidence.com/AceReports/Report/7741
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/Search\/$/i.exec(path)) !== null) {
    // https://myorthoevidence.com/Search/?SearchTerm=Lower+Extremity
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
