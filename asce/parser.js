#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme AMERICAN SOCIETY OF CIVIL ENGINEERS
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/toc\/(([a-z0-9]+)\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://ascelibrary.org/toc/jmenea/31/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];

  } else if ((match = /^\/toc\/(([a-z0-9]+)\/current)$/.exec(path)) !== null) {
    // http://ascelibrary.org/toc/jmenea/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/doi\/(abs|full|pdf|ipdf|pdfplus)\/([0-9.]+\/\([A-Z]+\)[A-Z]+\.([0-9]{4}-[0-9]{4})\.[0-9]+)$/.exec(path)) !== null) {
    // http://ascelibrary.org/doi/full/10.1061/(ASCE)ME.1943-5479.000279
    // http://ascelibrary.org/doi/pdf/10.1061/%28ASCE%29ME.1943-5479.000279
    result.doi    = match[2];
    result.unitid = match[2];
    result.online_identifier = match[3];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'ipdf':
    case 'pdfplus':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  }

  return result;
});

