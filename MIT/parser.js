#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MIT Press
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
  let doi_prefix = '10.1162/';

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search/i.test(path)) {
    // https://mitpress.mit.edu:443/search?keywords=potato
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/action\/doSearch$/i.exec(path)) {
    // https://www.mitpressjournals.org:443/action/doSearch?AllField=potato
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (Object.getOwnPropertyNames(param) == 's') {
    // https://www.leoalmanac.org:443/?s=art
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/toc\/(.*)$/i.exec(path)) !== null) {
    // https://www.mitpressjournals.org:443/toc/daed/145/3
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/loi\/(.*)$/i.exec(path)) !== null) {
    // https://www.mitpressjournals.org:443/loi/daed
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/journal\/(([0-9]{2}\.[0-9]{4})\/(.*))$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/journal/10.1162/jocn.2009.21112
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.doi      = match[1];
    result.title_id = match[3];
  } else if ((match = /^\/doi\/full\/(([0-9]{2}\.[0-9]{4})\/([0-9a-zA-Z_.]+))$/i.exec(path)) !== null) {
    // https://www.mitpressjournals.org:443/doi/full/10.1162/DAED_a_00392
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.doi      = match[1];
    result.title_id = match[3];
  } else if ((match = /^\/pub\/([0-9a-zA-Z-]+)$/i.exec(path)) !== null) {
    // https://contemporaryarts.mit.edu:443/pub/0hm1gas
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/pdfviewer\/journal\/([0-9a-zA-Z.]+)$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/pdfviewer/journal/jocn.2009.21112
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = doi_prefix + match[1];
    result.doi      = doi_prefix + match[1];
    result.title_id = match[1];
  } else if ((match = /^\/pdfviewer\/book\/(([0-9]+)\/(.*))$/i.exec(path)) !== null) {
    // http://cognet.mit.edu.proxy.library.emory.edu/pdfviewer/book/9780262329644/chap2
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    result.print_identifier = match[2];
  } else if ((match = /^\/doi\/pdf\/(([0-9]{2}\.[0-9]{4})\/([0-9a-zA-Z_.]+))$/i.exec(path)) !== null) {
    // https://www.mitpressjournals.org:443/doi/pdf/10.1162/DAED_a_00392
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    result.doi      = match[1];
    result.title_id = match[3];
  } else if ((match = /^\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/(.*).pdf$/i.exec(path)) !== null) {
    // https://test.leoalmanac.org:443/wp-content/uploads/2012/12/ISEA2011Uncontainable-Not-There.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/erefschapter\/(.*)$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/erefschapter/preface-to-first-edition-0
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/system\/cogfiles\/books\/([0-9]+)\/pdfs\/(.*).pdf$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/system/cogfiles/books/9780262329828/pdfs/9780262329828_chap3.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = match[2];
    result.print_identifier = match[1];
  } else if ((match = /^\/system\/cogfiles\/journalpdfs\/(.*).pdf$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/journal/10.1162/netn_a_00037
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = doi_prefix + match[1];
    result.doi      = doi_prefix + match[1];
    result.title_id = match[1];
  } else if ((match = /^\/book\/(.*)$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/book/becoming-human
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/erefs\/(.*)$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/erefs/cognitive-neurosciences-5th-edition
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/journals/journal-of-cognitive-neuroscience/21/8
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/topics\/(.*)$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/topics/299
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/books\/(.*)$/i.exec(path)) !== null) {
    // https://mitpress.mit.edu:443/books/open-access
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/journal-issue\/(.*)$/i.exec(path)) !== null) {
    // https://www.leonardo.info:443/journal-issue/leonardo-electronic-almanac/22/2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/journals\/(.*)$/i.exec(path)) !== null) {
    // http://cognet.mit.edu:80/journals/journal-of-cognitive-neuroscience/21/8
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  }

  return result;
});
