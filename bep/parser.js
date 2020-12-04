#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Business Expert Press e-books from IG Publishing
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

  if ((match = /^\/iglibrary\/export\/book\/(BEPB[0-9]{7})\.epub$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    // https://a.cloud.igpublish.com:443/iglibrary/export/book/BEPB0000961.epub
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.unitid = match[1];

  } else if  ((match = /^\/iglibrary\/export\/book\/(BEPB[0-9]{7})\.pdf$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    // https://a.cloud.igpublish.com:443/iglibrary/export/book/BEPB0000961.epub
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/iglibrary\/viewerplus\/book\/(BEPB[0-9]{7})\//i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    // https://a.cloud.igpublish.com:443/iglibrary/viewerplus/book/BEPB0000962/1/40288b8c2f8a9868012f8ac6bfa7000a/b49194acb515406cbd0a5730f5374836/40288b8c2f8a9868012f8ac6bfa7000a/none
    result.rtype    = 'BOOK';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  }

  return result;
});
