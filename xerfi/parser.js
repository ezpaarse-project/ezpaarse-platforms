#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Xerfi
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/xerfi[a-z-]+\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // /xerfi-canal-campus/Comprendre-lanalyse-SWOT_3746886
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/xerfi[a-z-]+\/extrait-video-report\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // /xerfifrance/extrait-video-report/Les-marches-du-luxe-et-la-consommation-collaborative
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[1];

  } else if ((match = /^\/STAMP\/PdfEcole\/([a-z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /STAMP/PdfEcole/2246421-8ERH10-mUtslA3v.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/Etudes_sectorielles_non_imprimablesE\/[a-z0-9]+\/pdf\/([a-z0-9-]+).pdf$/i.exec(path)) !== null) {
    // /Etudes_sectorielles_non_imprimablesE/secteur700doc/pdf/4DIS28-jyJAXyVY.pdf
    result.rtype  = 'REPORT';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if (/^\/rechercheretude\/[a-z0-9]+$/i.test(path)) {
    // /rechercheretude/automobile
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});

