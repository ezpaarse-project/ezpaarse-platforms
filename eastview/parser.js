#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform East View
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/browse\/book\/reader\/(([0-9]+)\/book.+)$/i.exec(path)) !== null) {
    // https://dlib.eastview.com/browse/book/reader/64626/book11_.swf?time=1483267719013
    // https://dlib.eastview.com/browse/book/reader/64626/book37_.swf?time=1483267719091
    // https://dlib.eastview.com/browse/book/reader/64626/book356_.swf?time=1483267720198
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = `${match[1]}${parsedUrl.search || ''}`;

  } else if ((match = /^\/issue_images\/((.+)\/([0-9]+)\/(.+)\.jpg)$/i.exec(path)) !== null) {
    // https://dlib.eastview.com/issue_images/RUSEB2162959BO/1996/coverbig.jpg
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
