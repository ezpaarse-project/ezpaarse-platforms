#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Embase
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let hash = parsedUrl.hash;
  let match;

  if (hash && hash.toLowerCase().startsWith('#advancedsearch')) {
    // /#advancedSearch/resultspage/history.1/page.1/25.items/orderby.date/source.
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/rest\/searchresults\/results$/i.test(path) && param.offset === '0') {
    // /rest/searchresults/results?offset=0&size=10
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/search\/results$/i.test(path)) {
    // /search/results?subaction=viewrecord&rid=1&page=1&id=L601051912
    result.mime = 'HTML';
    if (param && param.subaction === 'viewrecord') {
      result.rtype = 'RECORD_VIEW';
    }
    if (param && param.id) {
      result.unitid = param.id;
    }
  } else if (/^\/records$/i.test(path)) {
    // /records?id=L2041714855
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';

    if (param.id) {
      result.unitid = param.id;
    }
  } else if ((match = /^\/journals\/([0-9X]+)$/i.exec(path)) !== null) {
    // /journals/00946354
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
