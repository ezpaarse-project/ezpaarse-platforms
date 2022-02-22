#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform J-Stage
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

  if ((match = /^\/result\/global\/-char\/[a-z]+$/i.exec(path)) !== null) {
    // https://www.jstage.jst.go.jp/result/global/-char/en?globalSearchKey=rocks
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/article\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([0-9_]+)\/_([a-z]+)\/-char\/[a-z]+$/i.exec(path)) !== null) {
    // https://www.jstage-jst.go.jp/article/grsj/36/2/36_87/_pdf/-char/en
    // https://www.jstage.jst.go.jp/article/grsj/36/2/36_87/_article/-char/en
    // https://www.jstage.jst.go.jp/article/jtca/36/2/36_21/_html/-char/en
    if (match[5] == 'pdf') {
      result.mime     = 'PDF';
      result.rtype    = 'ARTICLE';
    } else if (match[5] == 'html') {
      result.mime     = 'HTML';
      result.rtype    = 'ARTICLE';
    } else if (match[5] == 'article') {
      result.mime     = 'HTML';
      result.rtype    = 'ABS';
    }
    result.vol = match[2];
    result.issue   = match[3];
    result.title_id = match[1];
    result.unitid = match[4];
  }

  return result;
});
