#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform utb
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

  if ((match = /^\/doi\/(10.[0-9]+\/([0-9]+)([0-9-]+)?)$/i.exec(path)) !== null) {
    // /doi/10.36198/9783838536118-151-214
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.doi = match[1];
    result.unitid = `${match[2]}${match[3]}`;
    result.online_identifier = match[2];
  } else if ((match = /^\/doi\/epdf\/(10.[0-9]+\/([0-9]+)([0-9-]+)?)$/i.exec(path)) !== null) {
    // /doi/10.36198/9783838536118-151-214
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.doi = match[1];
    result.unitid = `${match[2]}${match[3]}`;
    result.online_identifier = match[2];
  } else if ((match = /^\/doi\/book\/(10.[0-9]+\/([0-9]+))$/i.exec(path)) !== null) {
    // /doi/10.36198/9783838536118
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.doi = match[1];
    result.unitid = match[2];
    result.online_identifier = match[2];
  }

  return result;
});
