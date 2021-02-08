#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Avention
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

  if ((match = /^\/search\/article$/i.exec(path)) !== null) {
    // https://app.avention.com/search/article?q=snow
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/(company|industry)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://app.avention.com/company/47f1ee50-e624-346f-8336-bdf7e4b3ac47#report/company_summary
    // https://app.avention.com/industry/2bae4095-871d-3f89-ac09-40a390b8b176#report/industry_summary
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/API\/Report\/ApplinkPDF\/API\/Custom\/FetchAnalystsReport.aspx$/i.exec(path)) !== null) {
    // https://app.avention.com/API/Report/ApplinkPDF/API/Custom/FetchAnalystsReport.aspx?DocID=90507689
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.DocID;
  }

  return result;
});
