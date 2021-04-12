#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Droz
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

  if ((match = /^\/book\/([0-9]+)$/i.exec(path)) !== null) {
    // /book/9782600000826
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.online_identifier = match[1];
  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // /search?menu=search
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
