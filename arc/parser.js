#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Aerospace Research Central
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/loi\/([a-zA-Z]+)$/.exec(path)) !== null) {
    // http://arc.aiaa.org/loi/aiaaj
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/toc\/(([a-zA-Z]+)\/([0-9]+)\/([0-9]+))$/.exec(path)) !== null) {
    // http://arc.aiaa.org/toc/aiaaj/52/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];

  } else if ((match = /^\/doi(\/abs|\/full|\/pdf|\/pdfplus)?\/([0-9.]+\/([^/.]+\.[^/]+))$/.exec(path)) !== null) {
    // http://arc.aiaa.org/doi/abs/10.2514/1.J052182
    // https://arc.aiaa.org/doi/10.2514/1.J057846
    // https://arc.aiaa.org/doi/full/10.2514/1.J057846
    result.unitid = match[3];
    result.doi    = match[2];

    switch (match[1]) {
    case '/abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case '/pdf':
    case '/pdfplus':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    default:
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    }
  }

  return result;
});

