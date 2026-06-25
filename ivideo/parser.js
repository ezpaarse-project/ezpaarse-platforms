#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lib Video
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/view\/latest-news-content\.aspx$/i.test(path)) {
    // https://www.lib.video/view/latest-news-content.aspx?id=114&S=cyut
    // https://www-lib-video.cyut.idm.oclc.org/view/latest-news-content.aspx?id=46&S=cyut
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.id;
  } else if (/^\/searchResult\.aspx$/i.test(path)) {
    // https://www-lib-video.cyut.idm.oclc.org/searchResult.aspx?kw=%E5%8F%B0%E7%81%A3%E5%BF%83%E5%8B%95%E7%B7%9A&s=cyut
    // https://www-lib-video.cyut.idm.oclc.org/searchResult.aspx?kw=%E9%9B%9C%E8%B2%A8%E5%BA%97&s=cyut
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
  } else if ((match = /^\/uploadFiles\/Video\/([^./]+)\.mp4$/i.exec(path)) !== null) {
    // https://www.lib.video/uploadFiles/Video/AA0023-0001.mp4
    // https://www.lib.video/uploadFiles/Video/AE0115-0000.mp4
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[1];
  }

  return result;
});
