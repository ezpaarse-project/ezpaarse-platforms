#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bizboard
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

  if ((match = /^\/houjin\/cgi-bin\/nsearch\/md_pdf.pl\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // http://bizboard.nikkeibp.co.jp/houjin/cgi-bin/nsearch/md_pdf.pl/0000479871.pdf?NEWS_ID=0000479871&CONTENTS=1&bt=ND&SYSTEM_ID=HO
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/dic_supple\/([a-z0-9]+)\.html$/i.exec(path)) !== null) {
    // http://bizboard.nikkeibp.co.jp/dic_supple/2011supple0730.html?bzb_pt=0
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/b_servlet\/SearchServlet$/i.test(path)) {
    // http://bizboard.nikkeibp.co.jp/b_servlet/SearchServlet
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
