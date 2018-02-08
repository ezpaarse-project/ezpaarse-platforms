#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Brepols
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;
  let title;

  if ((match = /^\/([a-z]+)\/search.cfm$/.exec(path)) !== null) {
    // http://apps.brepolis.net/bmb/search.cfm?action=search_simple_detail_single&startrow=1&
    // endrow=1&search_order=year_desc&FULL_TEXT=chateau&SOURCE=IMB%20OR%20BCM&search_selection=
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid=match[1];
  } else if ((match = /^\/([a-z]+)\/pages\/([^.]+).aspx$/.exec(path)) !== null) {
    // http://clt.brepolis.net/emgh/pages/FullText.aspx?ctx=AGAFJG
    // http://clt.brepolis.net/emgh/pages/Exporter.aspx?ctx=31193
    // http://clt.brepolis.net/dld/pages/ArticlePrinter.aspx?dict=BP&id=24222
    // http://clt.brepolis.net/dld/pages/QuickSearch.aspx
    // http://clt.brepolis.net/dld/pages/ImageProvider.aspx?name=DC7_215&x=661&y=642
    result.rtype    = 'BOOK_SECTION';
    result.title_id = match[1];
    result.unitid=match[1];
    if (match[2] === 'FullText') {
      result.mime     = 'HTML';
    } else if (match[2] === 'Exporter') {
      result.mime     = 'PDF';
    } else if (match[2] === 'ArticlePrinter') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[2] === 'QuickSearch') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[2] === 'ImageProvider') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'MISC';
    }
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // http://www.brepolsonline.net:80/action/doSearch?AllField=hitler
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/author\/.*$/i.test(path)) {
    // http://www.brepolsonline.net:80/author/Payen%2C+Pascal
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/doi\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/10.1484/J.VIATOR.2.301507
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/abs\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/abs/10.1484/J.ASH.1.102901
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/book\/(([0-9.]*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/book/10.1484/M.AS-EB.5.107423
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/doi/pdf/10.1484/J.ASH.1.102904
    result.mime     = 'PDF';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/loi\/([a-z]*)$/i.exec(path)) !== null) {
    // http://www.brepolsonline.net:80/loi/aboll
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    title           = match[1];
    if (title === 'aboll') {
      result.publication_title = 'Analecta Bollandiana';
    }
  }

  return result;
});
