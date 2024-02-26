#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Asahi
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/photoDB\/detail\.html$/i.test(path)) {
    // /photoDB/detail.html?id=0000053140&keywords=a
    result.rtype = 'IMAGE';
    result.mime = 'HTML';
    result.unitid = param.id;

  } else if (/^\/library2\/topic\/t-detail\.php$/i.test(path)) {
    // /library2/topic/t-detail.php
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if (/^\/library2\/graph\/g-image-frameset-main\.php$/i.test(path)) {
    // /library2/graph/g-image-frameset-main.php
    result.rtype = 'BOOK';
    result.mime = 'HTML';
  } else if (/^\/[a-z]+\/detail\/$/i.test(path)) {
    // /kiji/detail/?1705417150644
    // /kiji/detail/?1705417046206
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = Object.keys(parsedUrl.query)[0];
  } else if (/^\/[a-z]+\/pdf\/$/i.test(path)) {
    // /shimen/pdf/?1705416744329
    // /shimen/pdf/?1705416517642
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = Object.keys(parsedUrl.query)[0];
  } else if (/^\/[a-z]+\/result\.html$/i.test(path)) {
    // /photoDB/result.html?search_method=top&image_keywords=a&btn_execution=Submit&keywords_synonymous=1&per_page=20&mode=thumbnail&sort_key1=category_code&sort_key2=shooting_location_code&sort_key3=shooting_date_acceptance_date&sort_type=1&ascdesc1=desc&ascdesc2=asc&ascdesc3=desc
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/[a-z]+\/?([a-z]+\/)$/i.test(path)) {
    // /top/
    // /shimen/date/
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
