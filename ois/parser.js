#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Oxford Islamic Studies
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/article\/book\/[a-z0-9_-]+([0-9]{13})\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /article/book/islam-9780195141283/islam-9780195141283-chapter-8?_hi=2&_pos=1
    // /article/book/islam-9780195141283/islam-9780195141283-div1-45
    // /article/book/islam-9780195141283/islam-9780195141283-miscMatter-5
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'MISC';
    result.unitid = match[2];
    result.print_identifier = match[1];

  } else if ((match = /^\/article\/doc\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /article/doc/ps-islam-0089?_hi=38&_pos=1

    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/article\/opr\/([a-z0-9]+\/[a-z0-9_-]+)$/i.exec(path)) !== null) {
    // /article/opr/t236MIW/e0014?_hi=3&_pos=17
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/article\/opr\/[a-z0-9]+\/[a-z0-9]+\/images\/([^/]+)\.jpg$/i.exec(path)) !== null) {
    // /article/opr/t276/e3/images/9780195309911.abbasid.01.jpg?_hi=42&_pos=1
    result.rtype  = 'IMAGE';
    result.mime   = 'JPEG';
    result.unitid = match[1];
  } else if ((match = /^\/article\/full\/opr\/([a-z0-9]+)\/([a-z0-9]+)\/images\/([a-z0-9.]+).jpg$/i.exec(path)) !== null) {
    // /article/full/opr/t243/e4/images/9780195175929.ablution.1.jpg
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[3];
  } else if ((match = /^\/article\/full\/book\/([a-z0-9-]+)\/([a-z0-9-]+)\/images\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /article/full/book/islam-9780195107999/islam-9780195107999-div1-5/images/islam-9780195107999-figureGroup-11
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[3];
  }


  return result;
});
