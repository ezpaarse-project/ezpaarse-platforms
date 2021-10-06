#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The Fibonacci Quarterly
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

  if ((match = /^\/Papers\/([0-9-]+)\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.fq-math.ca/Papers/59-2/chu05302020.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[2];
    result.vol = match[1].split('-')[0];
    result.issue = match[1].split('-')[1];

  } else if ((match = /^\/Abstracts\/([0-9-]+)\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.fq-math.ca/Abstracts/59-2/chu1.pdf
    result.rtype    = 'ABS';
    result.mime     = 'PDF';
    result.unitid   = match[2];
    result.vol = match[1].split('-')[0];
    result.issue = match[1].split('-')[1];

  } else if ((match = /^\/([0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://www.fq-math.ca/59-2.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.vol = match[1].split('-')[0];
    result.issue = match[1].split('-')[1];
  }

  return result;
});
