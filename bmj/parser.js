#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform BMJ
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  let match;

  const doiPrefix = '10.1136/';

  if ((match = /^\/content\/([a-z0-9]+)\/([0-9]+)\/([a-z0-9-]+).full.pdf$/i.exec(path)) !== null) {
    // /content/bmj/379/bmj-2022-071517.full.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[3];
    result.title_id = match[1];
    result.vol = match[2];
    result.doi = doiPrefix + match[3];

  } else if ((match = /^\/content\/([0-9]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /content/379/bmj-2022-071517
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.vol = match[1];
    result.doi = doiPrefix + match[2];

  } else if ((match = /^\/archive\/online\/([0-9]{4}\/[0-9]{2}-[0-9]{2})$/i.exec(path)) !== null) {
    // /archive/online/2022/11-28
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
