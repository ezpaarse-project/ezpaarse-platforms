#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform emerging-neurologist
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/article\/view\/([0-9]+)$/i.exec(path)) !== null) {
    // /article/view/33
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = `article/view/${match[1]}`;


  } else if ((match = /^\/article\/view\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // article/view/33/43
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = `article/view/${match[1]}/${match[2]}`;
  }

  return result;
});
