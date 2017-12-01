#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * [description-goes-here]
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

  if ((match = /^\/wayf\/product\/(.*)$/i.exec(path)) !== null) {
    // https://www.kanopystreaming.com:443/wayf/product/fridays-farm
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/product\/(.*)$/i.exec(path)) !== null) {
    // http://emory.kanopystreaming.com:80/product/fridays-farm
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/video\/(.*)$/i.exec(path)) !== null) {
    // http://emory.kanopystreaming.com:80/video/fridays-farm
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/s$/i.test(path)) {
    // https://www.kanopystreaming.com:443/s?query=groundhog%20day
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/node\/(.*?)\//i.exec(path)) !== null) {
    // http://emory.kanopystreaming.com:80/node/100481/preview
    result.rtype    = 'PREVIEW';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if (/^\/catalog\/.*$/i.test(path)) {
    // https://www.kanopystreaming.com/catalog/documentaries
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/category\/catalog\/.*$/i.test(path)) {
    // https://www.kanopystreaming.com:443/category/catalog/business/career-development
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});