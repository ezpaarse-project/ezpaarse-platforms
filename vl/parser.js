#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Value Line
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

  if ((match = /^\/Search\/index.aspx$/i.exec(path)) !== null) {
    // https://www.valueline.com/Search/index.aspx?cx=010117891458446851464%3Asdbcf4jkowe&cof=FORID%3A11&ie=UTF-8&q=Bonds&cx=010117891458446851464%3Asdbcf4jkowe&cof=FORID%3A11&ie=UTF-8&q=Bonds
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/api\/report$/i.exec(path)) !== null) {
    // https://research.valueline.com/api/report?documentID=2185-VL_20210326_VLIS_IBM_1533_01-5BIJPP0JVN5U83KLUUOV2RAS0K
    result.rtype    = 'SUPPL';
    result.mime     = 'PDF';
    result.unitid   = param.documentID;

  } else if ((match = /^\/Secure\/Research\/Home$/i.exec(path)) !== null) {
    // https://research.valueline.com/Secure/Research/Home#list=recent&sec=company&sym=aem
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';

  } else if ((match = /^\/research$/i.exec(path)) !== null) {
    // https://research.valueline.com/research#list=dow30&sec=list
    result.rtype    = 'TABLE';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-z_]+)\/([a-z_]+)(\/([a-z_]+))?\/([a-z_]+)\.aspx$/i.exec(path)) !== null) {
    // https://www.valueline.com/Tools/Educational_Articles/Stocks/Bank_Earnings_Quality__Do_The_Numbers_Tell_The_Story_.aspx#.YKU906EpBaQ
    // https://www.valueline.com/Stocks/Industries/Industry_Overview__Telecom_Services.aspx    
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[5];

  }

  return result;
});
