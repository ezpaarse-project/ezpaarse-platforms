#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes access to Films on Demand
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

  if ((match = /^\/p_Search.aspx$/i.exec(path)) !== null) {
    // https://fod.infobase.com/p_Search.aspx?bc=0&rd=a&q=Ali
    // https://fod.infobase.com/p_Search.aspx?rd=a&q=%22Asteroid%20mining%22
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/p_ViewVideo.aspx$/i.exec(path)) !== null) {
    // https://fod.infobase.com/p_ViewVideo.aspx?xtid=51930&loid=182352&tScript=0
    // https://fod.infobase.com/p_ViewVideo.aspx?xtid=165465&tScript=0
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.title_id = param.xtid;
    result.unitid   = param.xtid;
  } else if ((match = /^\/p_Collection.aspx$/i.exec(path)) !== null) {
    // https://fod.infobase.com/p_Collection.aspx?seriesID=168054
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }

  return result;
});
