#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ambrose Digital Video
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

  if ((match = /^\/[A-Z]+\/(.*).mp4$/i.exec(path)) !== null) {
    // http://cfph.ambrosevideo.com:80/FGX/FGX.mp4
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/ambrose-news\/(.*)$/i.exec(path)) !== null) {
    // http://www.ambrosevideo.com:80/ambrose-news/136-library-discovery-services
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/screening-room\/list-titles$/i.test(path)) {
    // http://www.ambrosevideo.com:80/screening-room/list-titles
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/screening-room\/(.*)$/i.exec(path)) != null) {
    // http://www.ambrosevideo.com:80/screening-room/133-nrs
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
