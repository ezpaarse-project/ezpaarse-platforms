#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Physiological Society
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

  if ((match = /^\/doi\/(epdf|full|abs)\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+)$/i.exec(path)) !== null) {
    // https://journals.physiology.org/doi/epdf/10.1152/jappl.1995.79.1.214
    // https://journals.physiology.org/doi/full/10.1152/jappl.1997.82.3.755
    // https://journals.physiology.org/doi/abs/10.1152/jappl.1995.79.1.214
    result.rtype    = 'ARTICLE';
    switch (match[1]) {
    case 'epdf':
      result.mime     = 'PDF';
      break;
    case 'full':
      result.mime     = 'HTML';
      break;
    case 'abs':
      result.rtype    = 'ABS';
      result.mime    = 'HTML';
      break;

    default:
      break;
    }
    result.unitid = match[2];
    result.doi = match[2];

  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://journals.physiology.org/action/doSearch?AllField=Compartment+Syndrome
    // https://journals.physiology.org/action/doSearch?AllField=Compartment+Syndrome&startPage=&SeriesKey=jappl
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = param.SeriesKey;
  }

  return result;
});
