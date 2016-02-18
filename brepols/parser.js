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

  var match;

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
  }
  return result;
});

