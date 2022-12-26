#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nikkei Value Search
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

  if (/^\/macro\/[a-z]+$/i.test(path)) {
    // https://valuesearch.nikkei.com/macro/statistics?corpIndustyKbn=5&keyword=work
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';

  } else if (/^\/popup$/i.test(path)) {
    // https://valuesearch.nikkei.com/popup?keyBody=DISNWS140120220815520127&transitionId=7dfddbd2-d0fb-47f9-bba7-1c8a11e4ff63&tldTransitionId=&corpIndustyKbn=6&pathname=/searchlist/news&mediaFeeType=0&keyBodyFare=0&articleId=DISNWS140120220815520127&pdfViewer=true&keywords=work
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid   = param.keyBody;
  } else if (/^\/corp\/summary$/i.test(path)) {
    // https://valuesearch.nikkei.com/corp/summary?corpIndustyCode=0005010001166966&corpIndustyKbn=1&corpType=5&corpStkCode=%E9%9D%9E%E4%B8%8A%E5%A0%B4&asrf=
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = param.corpIndustyCode;
  } else if (/^\/searchlist\/corp$/i.test(path)) {
    // https://valuesearch.nikkei.com/searchlist/corp?searchParam=work
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
