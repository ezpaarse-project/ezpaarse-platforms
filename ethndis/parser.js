#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ethnicity & Disease
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/edonline\/index.php\/ethndis\/search\/search$/i.test(path)) || (/^\/edonline\/index.php\/ethndis\/search$/i.test(path))) {
    // https://www.ethndis.org:443/edonline/index.php/ethndis/search/search?query=brain&authors=&title=&abstract=&galleyFullText=&suppFiles=&dateFromMonth=&dateFromDay=&dateFromYear=&dateToMonth=&dateToDay=&dateToYear=&dateToHour=23&dateToMinute=59&dateToSecond=59&discipline=&subject=&type=&coverage=&indexTerms=
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (((match = /^\/edonline\/index.php\/ethndis\/issue\/([a-z-]+)$/i.exec(path)) !== null) || ((match = /^\/edonline\/index.php\/ethndis\/issue\/view\/([0-9]+)$/i.exec(path)) !== null)) {
    // https://www.ethndis.org:443/edonline/index.php/ethndis/issue/archive
    // https://www.ethndis.org:443/edonline/index.php/ethndis/issue/view/43
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/edonline\/index.php\/ethndis\/article\/(view|viewFile|download)\/([0-9]+)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    result.title_id = match[2] + '/'+ match[3] + '/'+ match[4];
    result.unitid   = match[2] + '/'+ match[3] + '/'+ match[4];
    if (match[1] == 'view') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'viewFile') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'download') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }

  } else if ((match = /^\/edonline\/index.php\/ethndis\/article\/(view|viewFile|download)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    result.title_id = match[2] + '/'+ match[3];
    result.unitid   = match[2] + '/'+ match[3];
    if (match[1] == 'view') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'viewFile') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'download') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }

  } else if ((match = /^\/edonline\/index.php\/ethndis\/article\/(view|viewFile|download)\/([0-9]+)$/i.exec(path)) !== null) {
    result.title_id = match[2];
    result.unitid   = match[2];
    if (match[1] == 'view') {
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'viewFile') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'download') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }

  }

  return result;
});
