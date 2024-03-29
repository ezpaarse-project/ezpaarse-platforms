#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform TeachingBooks
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

  // let match;

  if (/^\/tb.cgi$/i.test(path) && param.go !== undefined && param.keywordText1 !== undefined) {
    // /tb.cgi?go=1&adv=all&keywordType1=all&implicitWild=0&keywordText1=green
    // /tb.cgi?go=1&adv=all&keywordType1=all&implicitWild=0&keywordText1=Homer
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/tb.cgi$/i.test(path) && param.tid !== undefined) {
    // /tb.cgi?tid=63012#Resources
    // /tb.cgi?tid=60280
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = param.tid;
  } else if (/^\/pronounce.cgi|book_reading.cgi$/i.test(path) && (param.aid !== undefined || param.id !== undefined)) {
    // /pronounce.cgi?aid=718
    // /book_reading.cgi?id=15222
    result.rtype = 'AUDIO';
    result.mime = 'MP3';
    result.unitid = param.aid !== undefined ? param.aid : param.id;
  } else if (/^\/author_collection.cgi$/i.test(path) && param.id !== undefined) {
    // /author_collection.cgi?id=13&mid=25
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = param.id;
  } else if (/^\/clp.cgi|agr.cgi$/i.test(path) && (param.master_id !== undefined || param.url_id !== undefined)) {
    // /clp.cgi?master_id=60280&lf_id=9
    // /agr.cgi?r=1&ri=62612&url_id=242982&i=&x=1
    result.rtype = 'EXERCISE';
    result.mime = 'PDF';
    result.unitid = param.master_id !== undefined ? param.master_id : param.url_id;
  }

  return result;
});
