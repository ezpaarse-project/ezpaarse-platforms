#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Vocable Numérique
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

  if (/^\/[a-z]{2,3}\/pvPage(2|H5B)\.asp$/i.test(path) || /^\/numerique\/learning\/pveditorsla6$/i.test(path)) {
    // /numerique/learning/pveditorsla6?puc=005431&nu=739&tmpid=aa74dc0d9931ad93c5a0dd750270cd96&idp=248
    // /fr/pvPage2.asp?puc=005431&nu=725&tmpid=abc2b40acad1147c223835752177d0f8
    // /fr/pvPageH5B.asp?puc=005879&nu=736&pa=1#8
    result.rtype = 'ISSUE';
    result.mime  = 'HTML';
    result.issue = param.nu;

    if (param.nu && param.puc) {
      result.unitid = `${param.puc}${param.nu}`;
    }

  } else if ((match = /^\/basearticle\/artfiles\/([0-9]+\/[^/]+)\.pdf$/i.exec(path)) !== null) {
    // /basearticle/artfiles/4184/Pages%20de%20VocGB715-2.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1].toLowerCase().replace(/\s/g, '_');

  } else if (/^\/numerique\/learning(?:\/archive)?$/.test(path)) {
    // /numerique/learning
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if (/^\/numerique\/learning\/recherche$/.test(path)) {
    // /numerique/learning/recherche
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/numerique\/learning\/quiz\/([0-9]+)$/i.exec(path)) !== null) {
    // /numerique/learning/quiz/10002#
    result.rtype  = 'EXERCISE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
