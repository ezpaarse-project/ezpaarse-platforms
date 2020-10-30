#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MDPI
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;


  if ((match = /^\/(([0-9]{4}-[0-9x]{4})\/[0-9]+\/[0-9]+\/[0-9]+)(\/(html?|pdf))?$/i.exec(path)) !== null) {
    // /2227-7390/8/10/1668
    // /2227-7390/8/10/1668/htm
    // /2227-7390/8/10/1668/pdf

    result.unitid = match[1];
    result.print_identifier = match[2];

    switch (match[3]) {
    case '/htm':
    case '/html':
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;
    case '/pdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    default:
      result.rtype = 'ABS';
      result.mime = 'HTML';
    }
  }

  return result;
});
