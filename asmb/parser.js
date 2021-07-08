#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Society for Microbiology
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

  if ((match = /^\/doi(\/(full|pdf|epub))?\/(10.[0-9]+\/([a-z]+).([a-z0-9-]+))$/i.exec(path)) !== null) {
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

    if (match[2] === 'pdf') {
      result.mime   = 'PDF';
    }
    if (match[2] === 'epub') {
      result.mime   = 'EPUB';
    }

    result.unitid = `${match[4]}.${match[5]}`;
    result.title_id = match[4];
    result.doi = match[3];
  } else if ((match = /^\/toc\/(([a-z]+)\/[a-z0-9/]+)$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  }

  return result;
});
