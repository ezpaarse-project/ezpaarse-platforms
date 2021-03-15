#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform INIS - IAEA
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let query  = parsedUrl.query || {};

  let match;

  if (/^\/search\/search\.aspx$/i.test(path)) {
    // /search/search.aspx?orig_q=reactor&src=ics
    // /search/search.aspx?search-option=everywhere&orig_q=reactor&mode=Advanced&translateTo=
    // /search/search.aspx?orig_q=descriptors:%22EBR-1%20REACTOR%22
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/search\/searchsinglerecord\.aspx$/i.test(path)) {
    // /search/searchsinglerecord.aspx?recordsFor=SingleRecord&RN=4076969
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = query.RN;

  } else if ((match = /^\/collection\/[a-z0-9]+\/.+?\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // /collection/NCLCollectionStore/_Public/13/664/13664661.pdf?r=1
    result.mime   = 'PDF';
    result.unitid = match[1];
  }

  return result;
});
