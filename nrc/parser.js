#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme New Research Press
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


  var match;

  if ((match = /^\/loi\/([a-z]+)$/.exec(path)) !== null) {
    // http://www.nrcresearchpress.com/loi/cjbio
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if ((match = /^\/toc\/(([a-z]+)\/([0-9]+)\/([0-9]+))$/.exec(path)) !== null) {
    // http://www.nrcresearchpress.com/toc/bcb/87/6
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = match[1];
    result.vol = match[3];
    result.issue = match[4];
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}\.[0-9]{4,5})\/([^.]+)$/.exec(path)) !== null) {
    // http://www.nrcresearchpress.com/doi/abs/10.1139/O09-044#.Vqcj0vnhBaQ
    result.unitid   = match[3].split('#')[0];
    result.doi = match[2] + '/' + result.unitid ;

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    switch (match[1]) {
    case 'abs':
      result.mime     = 'MISC';
      result.rtype    = 'ABS';
      break;
    case 'full':
      result.mime     = 'HTML';
      break;
    case 'pdfplus':
      result.mime     = 'PDFPLUS';
      break;
    }

  }

  return result;
});

