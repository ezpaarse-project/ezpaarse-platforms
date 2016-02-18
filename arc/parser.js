#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Aerospace Research Central
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /\/loi\/([a-zA-Z]+)$/.exec(path)) !== null) {
    // http://arc.aiaa.org/loi/aiaaj
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /\/toc\/(([a-zA-Z]+)\/([0-9]+)\/([0-9]+))$/.exec(path)) !== null) {
    // http://arc.aiaa.org/toc/aiaaj/52/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];

  } else if ((match = /\/doi\/(abs|full|pdf|pdfplus)\/([0-9\.]+\/([^\/\.]+\.[^\/]+))$/.exec(path)) !== null) {
    // http://arc.aiaa.org/doi/abs/10.2514/1.J052182
    result.title_id = match[3];
    result.unitid   = match[2];
    result.doi      = match[2];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'pdfplus':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    }
  }

  return result;
});

