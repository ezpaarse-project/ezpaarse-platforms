#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform O'Reilly Learning
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

  if ((match = /^\/(playlists|topics)\/([a-z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://learning.oreilly.com/playlists/548e9af6-73d0-4319-8935-76d586e89818/
    // https://learning.oreilly.com/topics/finance-accounting/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/videos\/([a-z-]+)\/([0-9]+)\/([a-z0-9-_]+)\/$/i.exec(path)) !== null) {
    // https://learning.oreilly.com/videos/case-study-how/0636920696391/0636920696391-video338940/
    // https://learning.oreilly.com/videos/clean-code-fundamentals/9780134661742/9780134661742-code_01_01_00/
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid   = match[3];
  } else if ((match = /^\/library\/view\/([a-z0-9-]+)\/([0-9]+)\/([a-z0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://learning.oreilly.com/library/view/python-in-a/9781098113544/ch01.html
    // https://learning.oreilly.com/library/view/python-in-a/9781098113544/ch01.html#the_python_languag
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.print_identifier = match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/(library|videos)\/(([a-z-]+)\/)?([a-z-]+)\/([0-9]+)\/$/i.exec(path)) !== null) {
    // https://learning.oreilly.com/library/view/python-in-a/9781098113544/
    // https://learning.oreilly.com/videos/case-study-how/0636920696391/
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    if (match[1] == 'library') {
      result.print_identifier = match[5];
    }
    result.unitid = match[5];
  } else if ((match = /^\/search\/$/i.exec(path)) !== null) {
    // https://learning.oreilly.com/search/?q=python&type=*&rows=10
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
