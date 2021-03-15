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

  if (hash && hash.toLowerCase().startsWith('#advancedsearch')) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/search\/results$/i.test(path)) {
    result.mime = 'HTML';
    if (param && param.subaction === 'viewrecord') {
      result.rtype = 'RECORD_VIEW';
    }
    if (param && param.id) {
      result.unitid = param.id;
    }
  }

  return result;
});
