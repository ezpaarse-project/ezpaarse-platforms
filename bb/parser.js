#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bloomsbury
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

  if ((match = /^\/book\/([a-z-]+)\.pdf$/i.exec(path)) !== null) {
    // //www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature.pdf?dl
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/book\/([a-z-]+)\/([a-z0-9-]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature/ch1-concepts-of-the-afterlife.pdf?dl
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/book\/([a-z-]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature/ch1-concepts-of-the-afterlife
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/book\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/metaphors-of-death-and-resurrection-in-the-quran-an-intertextual-approach-with-biblical-and-rabbinic-literature/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/search$/i.test(path)) {
    // https://www.bloomsburycollections.com/search?searchString=rocks&newSearchRecord=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
