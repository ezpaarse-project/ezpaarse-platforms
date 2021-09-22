#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Revue Droz Histoire et Civilisation
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

  if ((match = /^\/index.php\/HCL\/issue\/view\/([0-9]+)$/i.exec(path)) !== null) {
    // /index.php/HCL/issue/view/148
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/index.php\/HCL\/article\/view\/([0-9/]+)$/i.exec(path)) !== null) {
    // /index.php/HCL/article/view/1892/3217
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/index.php\/HCL\/article\/download\/([0-9/]+)$/i.exec(path)) !== null) {
    // /index.php/HCL/article/download/2193/3668
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
  }

  return result;
});
