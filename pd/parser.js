#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform People's Daily
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

  if ((match = /^\/rmrb\/([0-9]{8})\/([0-9])$/i.exec(path)) !== null) {
    // http://data.people.com.cn/rmrb/20240213/1?code=2
    // http://data.people.com.cn/rmrb/20190201/1
    // http://data.people.com.cn/rmrb/20060203/1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (param.code) result.unitid = `${match[1]}/${match[2]}?code=${param.code}`;
    else result.unitid = `${match[1]}/${match[2]}`;
    result.publication_date = match[1];
  } else if (/^\/rmrb\/s$/i.test(path)) {
    // http://data.people.com.cn/rmrb/s?type=1&qs=%7B%22cds%22%3A%5B%7B%22cdr%22%3A%22AND%22%2C%22cds%22%3A%5B%7B%22fld%22%3A%22title%22%2C%22cdr%22%3A%22OR%22%2C%22hlt%22%3A%22true%22%2C%22vlr%22%3A%22AND%22%2C%22qtp%22%3A%22DEF%22%2C%22val%22%3A%22%E5%9B%BE%E7%89%87%E6%8A%A5%E9%81%93%22%7D%2C%7B%22fld%22%3A%22subTitle%22%2C%22cdr%22%3A%22OR%22%2C%22hlt%22%3A%22false%22%2C%22vlr%22%3A%22AND%22%2C%22qtp%22%3A%22DEF%22%2C%22val%22%3A%22%E5%9B%BE%E7%89%87%E6%8A%A5%E9%81%93%22%7D%2C%7B%22fld%22%3A%22introTitle%22%2C%22cdr%22%3A%22OR%22%2C%22hlt%22%3A%22false%22%2C%22vlr%22%3A%22AND%22%2C%22qtp%22%3A%22DEF%22%2C%22val%22%3A%22%E5%9B%BE%E7%89%87%E6%8A%A5%E9%81%93%22%7D%5D%7D%5D%2C%22obs%22%3A%5B%7B%22fld%22%3A%22dataTime%22%2C%22drt%22%3A%22DESC%22%7D%5D%7D
    // http://data.people.com.cn/rmrb/s?qs=%7B%22cds%22%3A%5B%7B%22cdr%22%3A%22AND%22%2C%22cds%22%3A%5B%7B%22fld%22%3A%22title%22%2C%22cdr%22%3A%22OR%22%2C%22hlt%22%3A%22true%22%2C%22vlr%22%3A%22OR%22%2C%22val%22%3A%22%E6%98%A5%E8%8A%82%E6%9D%A5%E4%B8%B4%E4%B9%8B%E9%99%85%22%7D%2C%7B%22fld%22%3A%22subTitle%22%2C%22cdr%22%3A%22OR%22%2C%22hlt%22%3A%22true%22%2C%22vlr%22%3A%22OR%22%2C%22val%22%3A%22%E6%98%A5%E8%8A%82%E6%9D%A5%E4%B8%B4%E4%B9%8B%E9%99%85%22%7D%2C%7B%22fld%22%3A%22introTitle%22%2C%22cdr%22%3A%22OR%22%2C%22hlt%22%3A%22true%22%2C%22vlr%22%3A%22OR%22%2C%22val%22%3A%22%E6%98%A5%E8%8A%82%E6%9D%A5%E4%B8%B4%E4%B9%8B%E9%99%85%22%7D%5D%7D%5D%2C%22obs%22%3A%5B%7B%22fld%22%3A%22dataTime%22%2C%22drt%22%3A%22DESC%22%7D%5D%7D&tr=A&ss=1&pageNo=1&pageSize=20
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/rmrb\/([0-9]{8})\/([0-9])\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // http://data.people.com.cn/rmrb/20240211/3/5b4cd22e04a04403a216bde5b0bd4d59
    // http://data.people.com.cn/rmrb/20240213/1/525ea7c72e594834a7664536242fdfd8
    // http://data.people.com.cn/rmrb/20200201/1/fa0c1d99c3c14d2983fead49c6fc7123
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.first_page = match[2];
    result.unitid   = match[3];
    result.publication_date = match[1];
  }

  return result;
});
