#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Fast Case
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


  if (/^\/results$/i.test(path) == true && param.docUid) {
    // https://fc7.fastcase.com/results?q=tort&docUid=22132905&currentView=results
    // https://fc7.fastcase.com/results?q=%22intellectual%20property%22&currentView=results&docUid=21173972
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.docUid;
  } else if (/^\/results$/i.test(path) == true) {
    // https://fc7.fastcase.com/results?q=tort
    // https://fc7.fastcase.com/results?q=%22intellectual%20property%22
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
