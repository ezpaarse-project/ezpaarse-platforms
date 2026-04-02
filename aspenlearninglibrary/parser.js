#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Aspen Learning Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/searchresults/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else {
    let match = /^\/videoshelf\/(\d+)\//i.exec(path);
    if (match) {
      result.rtype = 'VIDEO';
      result.mime = 'MISC';
      result.unitid = match[1];
    } else if ((match = /^\/product\/([^/]+)\/?$/i.exec(path)) !== null) {
      result.rtype = 'RECORD';
      result.mime = 'HTML';
      result.unitid = match[1];
      result.title_id = match[1];
    } else if ((match = /^\/epubreader\/([^/]+)\/?$/i.exec(path)) !== null) {
      result.unitid = match[1];
      if (param.epub) {
        result.rtype = 'BOOK';
        result.mime = 'EPUB';
        result.title_id = match[1];
        const goto = param.goto;
        if (goto) {
          let gotoMatch = /\[page_([^\]]+)\]/.exec(goto);
          if (!gotoMatch) {
            gotoMatch = /\[p(\d+)\]/.exec(goto);
          }
          if (gotoMatch) {
            result.first_page = gotoMatch[1];
          }
        }
      } else {
        result.rtype = 'AUDIO';
        result.mime = 'MP3';
      }
    }
  }

  return result;
});
