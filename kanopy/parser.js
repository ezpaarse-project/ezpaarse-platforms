#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Parser for KanopyStreaming
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/video\/(.*)$/i.exec(path)) !== null) {
    // http://emory.kanopy.com/video/fridays-farm
    // https://columbuslibrary.kanopy.com/video/apollo-13-untold-story
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/s$/i.test(path)) {
    // https://emory.kanopy.com/s?query=groundhog%20day
    // https://columbuslibrary.kanopy.com/s?query=apollo%2013
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  } else if (/^\/category\/(.*)$/i.test(path)) {
    // https://columbuslibrary.kanopy.com/category/492
    result.rtype = 'TOC';
    result.mime  = 'HTML';
  }

  return result;
});
