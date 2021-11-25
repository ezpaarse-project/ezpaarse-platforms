#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Google Scholar
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

  if (/^\/scholar$/i.test(path) && (param.cites || param.q && param.q.includes('related'))) {
    // https://scholar.google.com/scholar?cites=4386659974444794854&as_sdt=5,36&sciodt=0,36&hl=en
    // https://scholar.google.com/scholar?q=related:0gEkbAN64yEJ:scholar.google.com/&scioq=&hl=en&as_sdt=5,36&sciodt=0,36
    result.rtype = 'RESULT_CLICK';
    result.mime = 'HTML';
    if (param.cites) {
      result.unitid = param.cites;
    }
  } else if (/^\/scholar$/i.test(path)) {
    // https://scholar.google.com/scholar?hl=en&as_sdt=0%2C36&q=Rocks&btnG=
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
