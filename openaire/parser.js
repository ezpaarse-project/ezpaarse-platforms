#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme HAL - Archives Ouvertes
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  if (/^\/search\/publication$/.test(path)) {
    // https://www.openaire.eu/search/publication?articleId=od_______645::dbee9ee47425380c109cbd31dfdaa026
    if (param['articleId']) {
      result.title_id = param['articleId'];
      result.unitid   = param['articleId'];
    }
    result.rtype = 'ARTICLE';
    result.mime  = 'MISC';
  }
  return result;
});

