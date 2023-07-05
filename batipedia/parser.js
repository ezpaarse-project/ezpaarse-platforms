#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Batipédia
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let params = parsedUrl.query || {};
  let match;

  if ((match = /^\/document\/texte\/([a-z0-9_.-]+)\.html$/i.exec(path)) !== null) {
    // /document/texte/AHTF-2.html?article=AHTF-2_COR3
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = params.article;

  } else if ((match = /^\/pdf\/document\/([a-z0-9_.-]+)\.pdf$/i.exec(path)) !== null) {
    // /pdf/document/AHTF-2.pdf#zoom=100
    result.rtype    = 'RECORD_BUNDLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (/^\/rechercheREEF\.html$/i.test(path)) {
    // /rechercheREEF.html?options.completionShowValidation=false&....
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
