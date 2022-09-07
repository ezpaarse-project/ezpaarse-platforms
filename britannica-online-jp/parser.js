#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Britannica Online Japan
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

  if (/^\/search$/i.test(path)) {
    // https://japan-eb-com/search?query1=man&matchType=f&x=0&y=0
    // https://japan-eb.com/search?matchType=p&searchType=advanced&query1=man&exOp2=AND&query2=war&exOp3=AND&query3=american&exOp4=AND&query4=&gcode=&perPage=10&x=39&y=9
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/mb\/article-([0-9]+)_$/i.exec(path)) !== null) {
    // https://japan-eb.com/mb/article-130900_
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/mb\/print$/i.test(path)) {
    // https://japan-eb.com/mb/print?view=fullprint&articleId=130900
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.articleId;
  } else if (/^\/resources\/pdf\/([a-z_]+)\.pdf$/i.test(path)) {
    // https://japan-eb.com/resources/pdf/BOLJ_Guidetour.pdf
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'PDF';
  }

  return result;
});
