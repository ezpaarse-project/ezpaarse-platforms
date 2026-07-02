#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform UDN Data
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (path === '/ndapp/KnoBase/magol/searchDoc') {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.origid) { result.unitid = param.origid; }

  } else if (path === '/ndapp/KnoBase/magol/searchContent') {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (path === '/ndapp/fpStory/magol/fullPageView') {
    result.rtype = 'IMAGE';
    result.mime  = 'MISC';
    if (param.volume) { result.unitid = param.volume; }

  } else if (path === '/ndapp/udntag/fpp/FpSearch') {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (path === '/ndapp/udntag/fpp/FpStory') {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.news_id) { result.unitid = param.news_id; }

  } else if (/\/ndapp\/fp\/\d+\/udntag\/recordBehavior\.jsp/.test(path)) {
    result.rtype = 'IMAGE';
    result.mime  = 'MISC';
    if (param.GROUP_ID)   { result.title_id = param.GROUP_ID; }
    if (param.SERVICE_ID) { result.unitid   = param.SERVICE_ID; }
  }

  return result;
});
