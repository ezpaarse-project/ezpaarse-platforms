#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Encyclopædia Universalis
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^(\/encyclopedie\/.*)$/.exec(path)) !== null) {
    // http://www.universalis-edu.com/encyclopedie/denis-diderot/
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^(\/media\/)$/.exec(path)) !== null) {
    // http://www.universalis-edu.com/media/?tx_eu[mref]=PA080144&cHash=910be1509098c2bf0101bd4a8cae989b
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    if (param['tx_eu[mref]']) {
      result.unitid = param['tx_eu[mref]'];
    }
  } else if  ((match = /^(\/atlas\/.*)$/.exec(path)) !== null) {
    // http://www.universalis-edu.com/atlas/amerique/amerique-du-sud/argentine/
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  }

  return result;
});

