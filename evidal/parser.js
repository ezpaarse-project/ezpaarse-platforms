#!/usr/bin/env node

// ##EZPAARSE

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Evidal
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/(([a-zA-Z]+).html)$/.test(path)) {
    //http://www.evidal.fr/showProduct.html?productId=5480
    //http://www.evidal.fr/showReco.html?recoId=4048
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.recoId) {
      result.title_id = param.recoId;
      result.unitid   = param.recoId;
    } else if (param.productId) {
      result.title_id = param.productId;
      result.unitid   = param.productId;
    }
  }

  return result;
});

