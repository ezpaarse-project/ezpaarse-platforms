#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform KMW Chinatimes
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/News\/BanImgContent\.aspx/i.test(path)) {
    result.rtype = 'IMAGE';
    result.mime  = 'HTML';
    if (param.logno) { result.unitid = param.logno; }

  } else if (/^\/News\/ImgSResultList\.aspx/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/News\/NewsContent\.aspx/i.test(path)) {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.uid) { result.unitid = param.uid; }

  } else if (/^\/News\/NewsSearch\.aspx/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/EpubContent\/[^/]+\/\d+\/(\d+)\//i.exec(path))) {
    result.rtype  = 'ARTICLE';
    result.mime   = 'EPUB';
    result.unitid = match[1];

  } else if (/^\/DigtalBP\/Preview\.aspx/i.test(path)) {
    result.rtype = 'IMAGE';
    result.mime  = 'HTML';
    if (param.i) { result.unitid = param.i; }

  } else if (/^\/DigtalBP\/FVImgPreview\.aspx/i.test(path)) {
    result.rtype = 'IMAGE';
    result.mime  = 'HTML';
    if (param.sisse) { result.unitid = param.sisse; }

  } else if (/^\/Chinatimes\/EFNewsContetn\.aspx/i.test(path)) {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.sNo) { result.unitid = param.sNo; }

  } else if (/^\/Chinatimes\/ArticleContent\.aspx/i.test(path)) {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.aid) { result.unitid = param.aid; }
  }

  return result;
});
