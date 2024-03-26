#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Morningstar Investment Research Center
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

  if ((match = /^\/ArticleSuppot\/article$/i.exec(path)) !== null) {
    // http://library.morningstar.com/ArticleSuppot/article?id=1016715
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  } else if ((match = /^\/videos\/$/i.exec(path)) !== null) {
    // http://library.morningstar.com/videos/?id=1017223
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
  } else if ((match = /^\/v2\/quote$/i.exec(path)) !== null) {
    // http://library.morningstar.com/v2/quote?id=0P0001KOSA&typeid=ST
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  } else if ((match = /^\/Returns\/([0-9a-z]+.html)$/i.exec(path)) !== null) {
    // http://library.morningstar.com/Returns/CategoryReturns.html
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  } else if ((match = /^\/Returns\/([0-9a-z_]+).pdf$/i.exec(path)) !== null) {
    // http://library.morningstar.com/Returns/Consumer_Cyclical_Q4_2020.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
  } else if (/^\/home$/i.test(path) && parsedUrl.hostname === 'research.morningstar.com') {
    // https://research.morningstar.com/home
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';
  } else if (/^\/chart$/i.test(path) && parsedUrl.hostname === 'research.morningstar.com') {
    // https://research.morningstar.com/chart
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
  } else if (/^\/calendar$/i.test(path) && parsedUrl.hostname === 'research.morningstar.com') {
    // https://research.morningstar.com/calendar
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
  } else if ((match = /^\/articles\/([0-9a-zA-Z]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://research.morningstar.com/articles/1190828/charging-the-future-unleashing-the-power-of-battery-technology
    // https://research.morningstar.com/articles/1189996/inflation-still-expected-to-plummet
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id   = match[2];
    result.db_id      = match[1];
    result.unitid     = `${match[1]}/${match[2]}`;
  } else if ((match = /^\/api\/v1\/articles\/([0-9]+)\/file$/i.exec(path)) !== null) {
    // https://research.morningstar.com/api/v1/articles/1189179/file?type=AnalystClientResearch
    // https://research.morningstar.com/api/v1/articles/20151/file?type=CommonArticle
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
