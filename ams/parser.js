#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme American Meteorological Society
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  var match;

  if ((match = /^\/loi\/([a-z]+)$/.exec(path)) !== null) {
    // http://journals.ametsoc.org/loi/bams
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else if ((match = /^\/toc\/(([a-z]+)\/([0-9]+)\/([0-9]+))$/.exec(path)) !== null) {
    // http://journals.ametsoc.org/toc/bams/96/7
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];

  } else if ((match = /^\/doi\/([a-z]+)\/([0-9\.]+\/(([A-Z]+)-[A-Z]+-[0-9]+-[0-9\.]+))$/.exec(path)) !== null) {
    // http://journals.ametsoc.org/doi/abs/10.1175/BAMS-D-13-00212.1
    result.doi    = match[2];
    result.unitid = match[3];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'suppl':
      result.rtype = 'SUPPL';
      result.mime  = 'MISC';
      break;
    }

  } else if ((match = /^\/action\/([a-zA-Z]+)$/.exec(path)) !== null) {
    // http://journals.ametsoc.org/action/showFullPopup?id=fig1&doi=10.1175%2FBAMS-D-13-00212.1
    result.rtype = 'IMAGE';
    result.mime  = 'MISC';
    result.doi   = param.doi;

    if (param.doi) {
      result.unitid = param.doi.split('/')[1];
    }
  }

  return result;
});

