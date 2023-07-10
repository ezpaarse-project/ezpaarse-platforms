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

  if ((match = /^(?:\/[a-z0-9]+)?\/document\/(texte|fiche)\/([a-z0-9_.-]+)\.html$/i.exec(path)) !== null) {
    // /document/fiche/EYS-3.html
    // /document/texte/AHTF-2.html?article=AHTF-2_COR3
    // /reef/document/texte/AHTF-2.html?article=AHTF-2_COR3
    result.rtype    = match[1] === 'texte' ? 'ARTICLE' : 'RECORD';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = params.article || result.title_id;

  } else if ((match = /^(?:\/[a-z0-9]+)?\/pdf\/document\/([a-z0-9_.-]+)\.pdf$/i.exec(path)) !== null) {
    // /pdf/document/AHTF-2.pdf#zoom=100
    // /reef/pdf/document/AHTF-2.pdf#zoom=100
    result.rtype    = 'ARTICLES_BUNDLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (/^(?:\/[a-z0-9]+)?\/recherche[a-z0-9]+\.html$/i.test(path)) {
    // /rechercheREEF.html?options.completionShowValidation=false&....
    // /reef/rechercheREEF.html?options.completionShowValidation=false&....
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
