#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Akademiai Kiado
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

  if ((match = /^\/view\/journals\/([0-9]+)\/(([0-9]+)-overview)\.xml$/i.exec(path)) !== null) {
    // https://akjournals.com/view/journals/014/014-overview.xml?rskey=VvLrUC&result=2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/view\/journals\/([0-9]+)\/([0-9]+)\/([0-9]+)\/(([0-9]+).([0-9]+).issue-([0-9]+))\.xml$/i.exec(path)) !== null) {
    // https://akjournals.com/view/journals/014/61/4/014.61.issue-4.xml
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[4];
    result.vol = match[2];
    result.issue = match[3];
  } else if ((match = /^\/view\/journals\/([0-9]+)\/([0-9]+)\/([0-9]+)\/(article-p([0-9]+))\.xml$/i.exec(path)) !== null) {
    // HTML;https://akjournals.com/view/journals/014/61/4/article-p247.xml
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.first_page = match[5];
    result.unitid   = match[4];
  } else if (/^\/search$/i.test(path)) {
    // https://akjournals.com/search?q1=man
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
