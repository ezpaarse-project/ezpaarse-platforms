#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mathematical Sciences Publishers
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

  if ((match = /^\/([a-z]+)\/([0-9]+)\/([0-9]+)-([0-9]+)\/([0-9a-z-]+)\.pdf$/i.exec(path)) !== null) {
    // https://msp.org/gt/2022/26-1/gt-v26-n1-p03-s.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[5];
    result.title_id = match[1];
    result.publication_date = match[2];
    result.vol = match[3];
    result.issue = match[4];
    result.pii = match[5].split('-')[3];

  } else if ((match = /^\/([a-z]+)\/([0-9]+)\/([0-9]+)-([0-9]+)\/$/i.exec(path)) !== null) {
    // https://msp.org/gt/2022/26-1/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = match[3] + '-' + match[4];
    result.title_id = match[1];
    result.publication_date = match[2];
    result.vol = match[3];
    result.issue = match[4];
  } else if ((match = /^\/([a-z]+)\/([0-9]+)\/([0-9]+)-([0-9]+)\/([a-z0-9]+)\.xhtml$/i.exec(path)) !== null) {
    // https://msp.org/gt/2022/26-1/p03.xhtml
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid = match[5];
    result.title_id = match[1];
    result.publication_date = match[2];
    result.vol = match[3];
    result.issue = match[4];
    result.pii = match[5];
  }

  return result;
});
