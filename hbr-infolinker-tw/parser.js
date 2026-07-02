#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform HBR Infolinker TW
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

  if (path === '/video.php') {
    result.rtype = 'VIDEO';
    result.mime  = 'MISC';
    if (param.doi) {
      result.unitid = param.doi;
    }
  } else if (path === '/article.php') {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.doi) {
      result.unitid = param.doi;
    }
  } else if (path === '/result.php') {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
