#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Westlaw Derivatives Law and Practice
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

  if ((match = /^\/Document\/([a-z0-9]+)\/View\/FullText.html$/i.exec(path)) !== null) {
    // /Document/I0C834A40E44811DA8D70A0E70A78ED65/View/FullText.html
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
