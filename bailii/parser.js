#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform BAILII
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;
  let docMatch;

  if ((match = /^\/ie\/other\/([a-z]+)\/([0-9]+)\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.bailii.org/ie/other/IELRC/2008/87.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[3];
    result.publication_date = match[2];
    result.db_id = match[1];
  } else if ((match = /^\/cgi-bin\/format\.cgi$/i.exec(path)) !== null) {
    // https://www.bailii.org/cgi-bin/format.cgi?doc=/ie/other/IELRC/2008/87.html&query=(Murder)
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    docMatch = /^\/ie\/other\/([a-z]+)\/([0-9]+)\/([0-9]+)\.html$/i.exec(param.doc);
    result.unitid = docMatch[3];
    result.publication_date = docMatch[2];
    result.db_id = docMatch[1];
  } else if (/^\/cgi-bin\/lucy_search_1\.cgi$/i.test(path)) {
    // https://www.bailii.org/cgi-bin/lucy_search_1.cgi?method=boolean&highlight=1&sort=rank&query=(Murder)&results=200&mask_path=/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
