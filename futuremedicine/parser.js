#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Future Medicine
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

  if ((match = /(^\/doi\/full\/(.+))$/.exec(path)) !== null) {
    // http://www.futuremedicine.com/doi/full/10.2217/cnc.15.10
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi = match[2];
    result.unitid = match[1];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
  } 
    else if ((match = /(^\/doi\/pdf\/(.+))$/.exec(path)) !== null) {
    // http://www.futuremedicine.com/doi/pdf/10.2217/cnc.15.10
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi = match[2];
    //see the comment block above
    result.unitid   = match[1];
  }

  return result;
});

