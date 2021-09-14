#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bizminer
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

  if ((/^\/industry\/$/i.test(path))) {
    // https://www.bizminer.com/industry/?s_reset=&s=industry-search-tools&term=asdf&submit=Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((/^\/reports\/spf\/([a-z0-9_]+)\.pdf$/i.test(path))) {
    // http://www.bizminer.com/reports/spf/SPF_Report_2020.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
  } else if ((/^\/reports\/load_report\.php$/i.test(path))) {
    // http://www.bizminer.com/reports/load_report.php?profileID=18047846&format=csv    
    result.rtype    = 'REPORT';
    if (param.format == 'csv') {
      result.mime     = 'CSV';
    } else if (param.format == 'html') {
      result.mime     = 'HTML';
    }
  } else if ((/^\/imr\/report-2\/[0-9]+\/[a-z0-9]+$/i.test(path))) {
    // https://report.bizminer.com/imr/report-2/18047846/6f33812eb62a69e142b56aa350779cc7?format=html&academic=1
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  }

  return result;
});
