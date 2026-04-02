#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Aspen Learning Library
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

  if (/^\/searchresults/i.test(path)) {
    // /searchresults?option=catalog_shelf&searchinType=all&keyword=Constitutional&type=allBooks
    // /searchresults?option=catalog_shelf&searchinType=all&keyword=Criminal&type=quick
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/videoshelf\/(\d+)\//i.exec(path)) !== null) {
    // /videoshelf/75184/CRIMLAW_Introduction.m3u8
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];
  } else if ((match = /^\/product\/([^/]+)\/?$/i.exec(path)) !== null) {
    // /product/glannon-guide-to-criminal-procedure50207458
    // /product/casenote-legal-briefs-for-criminal-law-keyed-to-kadish-schulhofer50190989
    // /product/inside-adjudicative-criminal-procedure-what-matters
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];
  } else if ((match = /^\/epubreader\/([^/]+)\/?$/i.exec(path)) !== null) {
    result.unitid = match[1];
    if (param.epub) {
      // /epubreader/inside-adjudicative-criminal-procedure-what-matters?epub=https://readerservices.ipublishcentral.com/cch/50053175/epubreader/reprocess_165193/epubcontent_v2/&goto=epubcfi(/6/8!/4/2/2/2[page_iii])
      // /epubreader/glannon-guide-to-criminal-procedure50207458?
      // /epubreader/glannon-guide-to-criminal-procedure50207458?epub=https://readerservices.ipublishcentral.com/cch/50207458/epubreader/reprocess_211751/epubcontent_v2/&goto=epubcfi(/6/56!/4/2[p239])
      result.rtype = 'BOOK';
      result.mime = 'EPUB';
      result.title_id = match[1];
      const goto = param.goto;
      if (goto) {
        let gotoMatch = /\[page_([^\]]+)\]/.exec(goto);
        if (!gotoMatch) {
          gotoMatch = /\[p(\d+)\]/.exec(goto);
        }
        if (gotoMatch) {
          result.first_page = gotoMatch[1];
        }
      }
    } else {
      // /epubreader/civil-procedure50202567
      // /epubreader/criminal-procedure50202564
      result.rtype = 'AUDIO';
      result.mime = 'MP3';
    }
  }

  return result;
});