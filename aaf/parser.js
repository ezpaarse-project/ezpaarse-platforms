#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform allAfrica
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

  if ((match = /^\/download\/resource\/main\/main\/idatcs\/(.*):[a-z0-9]+.pdf$/i.exec(path)) !== null) {
    // http://allafrica.com:80/download/resource/main/main/idatcs/00111751:f3daf74e033943cd85650d285f28bed0.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/download\/resource\/main\/main\/idatcs\/(.*):[a-z0-9]+.mp3$/i.exec(path)) !== null) {
    // http://allafrica.com:80/download/resource/main/main/idatcs/00111925:d103fdb9f1dd661fa49b661274d15b12.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/list\/group\/main\/main\/h-resource\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/list/group/main/main/h-resource/bt.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/list\/photoessay\/post\/post\/doc\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/list/photoessay/post/post/doc/all.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/list\/resource\/main\/main\/cat\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/list/resource/main/main/cat/southafrica.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/list\/resource\/main\/main\/doc\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/list/resource/main/main/doc/all.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/list\/resource\/main\/main\/type\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/list/resource/main/main/type/doc.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/view\/group\/main\/main\/id\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/view/group/main/main/id/00059768.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/search/i.test(path)) {
    // http://allafrica.com:80/search/?search_string=england
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/stories\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/stories/201803230621.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/view\/resource\/main\/main\/id\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/view/resource/main/main/id/00111751.html
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/view\/photoessay\/post\/post\/id\/(.*).html$/i.exec(path)) !== null) {
    // http://allafrica.com:80/view/photoessay/post/post/id/201803260001.html
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/arts/i.test(path)) {
    // http://allafrica.com:80/arts/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/aid/i.test(path)) {
    // http://allafrica.com:80/aid/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }

  return result;
});
