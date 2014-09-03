#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Dawsonera
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

  if ((match = /^(\/abstract\/([0-9]+))$/.exec(path)) !== null) {
    // https://www.dawsonera.com/abstract/9780815517924
    result.rtype    = 'ABS';
    result.mime     = 'MISC';
    result.eisbn    = match[2];
    result.unitid   = match[1];
  } else if ((match = /^(\/readonline\/([0-9]+))$/.exec(path)) !== null) {
    // https://www.dawsonera.com/readonline/9780815517924
    result.rtype    = 'BOOK';
    result.mime     = 'MISC';
    result.eisbn    = match[2];
    result.unitid   = match[1];
  } else if ((match = /^(\/download\/drm\/[0-9]+\/([0-9]+))$/.exec(path)) !== null) {
    // https://www.dawsonera.com/download/drm/1646219554/9780815517924
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.eisbn    = match[2];
    result.unitid   = match[1];
  }

  return result;
});

