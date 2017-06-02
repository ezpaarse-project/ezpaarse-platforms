#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Rosen Digital
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


  if ((match = /^\/article\/(([0-9]+)\/([0-9]+)\/(.+))$/i.exec(path)) !== null) {
    // http://biology.rosendigital.com/article/495/5/the-effect-of-viruses-on-the-environment
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else  if ((match = /^\/article\/(([0-9]+)\/(.+))$/i.exec(path)) !== null) {
    // http://biology.rosendigital.com/article/495/1
    // http://chemistry.rosendigital.com/article/435/4
    // http://chemistry.rosendigital.com/article/453/10?search=news
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];

  }

  return result;
});
