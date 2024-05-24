#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Vision Media
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

  if (/^\/video\/search$/i.test(path)) {
    // https://cgust.app.visionmedia.com.tw/video/search?q=最新電影
    // https://cgust.app.visionmedia.com.tw/video/search?q=美味午餐大作戰
    // https://ntust.app.visionmedia.com.tw/video/search?q=最新電影
    // https://ntust.app.visionmedia.com.tw/video/search?q=美味午餐大作戰
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/video\/detail\/(trailer|movie)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://ntust.app.visionmedia.com.tw/video/detail/trailer/48a6dfd6-8723-4d26-9005-d9a2ac678c5d
    // https://cgust.app.visionmedia.com.tw/video/detail/trailer/feda4692-8aa5-4ac6-b33c-5c744482befb
    // https://cgust.app.visionmedia.com.tw/video/detail/movie/feda4692-8aa5-4ac6-b33c-5c744482befb
    // https://ntust.app.visionmedia.com.tw/video/detail/movie/70ce40f9-04b2-4a07-a56a-a99beb2b5694
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[2];

  } else if (/^\/video\/list$/i.test(path) && param.tag_name !== undefined) {
    // https://ntust.app.visionmedia.com.tw/video/list?tag_name=科幻奇幻
    // https://ntust.app.visionmedia.com.tw/video/list?tag_name=科幻奇幻&tag_name=西班牙語
    // https://cgust.app.visionmedia.com.tw/video/list?tag_name=西班牙語
    let isArray = Array.isArray(param.tag_name);
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (isArray) result.unitid = param.tag_name[param.tag_name.length-1];
    else result.unitid = param.tag_name;

  }

  return result;
});
