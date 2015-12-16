#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Ecological Society of America
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/toc\/([a-z]+)\/([a-z]+)$/.exec(path)) !== null) {
    // http://www.esajournals.org/toc/ecol/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = 'toc/'+  match[1] + '/' + match[2];
  } else if ((match = /^\/toc\/([a-z]+)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // http://www.esajournals.org/toc/ecol/96/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid   = 'toc/'+  match[1] + '/' + match[2] + '/' + match[3];
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9\.]+)\/([A-Z0-9\-\.]+)$/.exec(path)) !== null) {
    // http://www.esajournals.org/doi/pdf/10.1890/14-1043.1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi = match[2] + '/' + match[3];
    result.unitid   =  match[3];
  }

  return result;
});

