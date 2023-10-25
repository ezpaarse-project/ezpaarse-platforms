#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Informit
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

  if ((match = /^\/doi\/epdf\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+)$/i.exec(path)) !== null) {
    // https://search.informit.org/doi/epdf/10.3316/informit.273886063150734
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];
    result.doi = match[1];

  } else if ((match = /^\/doi\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+)$/i.exec(path)) !== null) {
    // https://search.informit.org/doi/10.3316/informit.273886063150734
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.doi = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://search.informit.org/action/doSearch?AllField=brazil&ConceptID=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
