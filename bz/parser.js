#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Browzine
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

  if ((match = /^\/libraries\/([0-9]+)\/journals\/([0-9]+)\/issues\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://browzine.com/libraries/170/journals/32094/issues/current?sort=title
    // https://browzine.com/libraries/170/journals/2728/issues/8381715?sort=title
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid = match[2] + '-' + match[3];

  } else if ((match = /^\/libraries\/([0-9]+)\/articles\/([0-9]+)$/i.exec(path)) !== null) {
    // https://browzine.com/libraries/170/articles/57846552?sort=title
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/libraries\/([0-9]+)\/subjects$/i.exec(path)) !== null) {
    // https://browzine.com/libraries/170/subjects?query=Brain
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
