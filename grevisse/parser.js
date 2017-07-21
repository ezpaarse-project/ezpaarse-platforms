#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Bon Usage Grevisse
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let hostname = parsedUrl.hostname;

  result.title_id = hostname;

  let match;

  if ((match = /^\/document\/([^/]+)$/i.exec(path)) !== null) {
    // http://www.lebonusage.com/document/p2ch3-80831
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/compare\/recherche\/([^/]+)/i.exec(path)) !== null) {
    // http://www.lebonusage.com/compare/recherche/p1ch2-31609/p2ch8-161255/
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/imprime$/i.exec(path)) !== null) {
    // hhttp://www.lebonusage.com/imprime
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = 'imprime';
  }
  // override HTML default if PDF download requested
  if (parsedUrl.hash && parsedUrl.hash === '#pdfBox') { result.mime = 'PDF'; }

  return result;
});

