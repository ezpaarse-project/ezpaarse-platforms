#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bentham Science
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

  if ((match = /^\/article\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.eurekaselect.com/article/127389
    // https://www.eurekaselect.com/article/121184
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/ebook_volume\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.eurekaselect.com/ebook_volume/863
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/issue\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.eurekaselect.com/issue/6135
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/journal\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.eurekaselect.com/journal/2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/bybook\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.eurekaselect.com/bybook/2008
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
