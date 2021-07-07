#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform LuxAccount
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

  // let match;

  if (/^\/secure\/documentview.aspx$/i.test(path)) {
    // /secure/documentview.aspx?id=rf300057903
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.id;
  } else if (/^\/secure\/showfile.aspx$/i.test(path)) {
    // /secure/showfile.aspx?originatingpage=documentview&id=rx1472073.pdf
    result.rtype = 'JURISPRUDENCE';
    result.mime = 'PDF';
    if (param.id) {
      result.unitid = param.id.replace(/.pdf$/, '');
    }
  }

  return result;
});
