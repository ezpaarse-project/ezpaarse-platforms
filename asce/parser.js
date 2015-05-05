#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme AMERICAN SOCIETY OF CIVIL ENGINEERS
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

  // use console.error() for debugging
  console.error("path: " + path);

  var match;

  if ((match = /^\/toc\/(([a-z0-9]+)\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://ascelibrary.org/toc/jmenea/31/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[1];
  } else if ((match = /^\/toc\/(([a-z0-9]+)\/current)$/.exec(path)) !== null) {
    // http://ascelibrary.org/toc/jmenea/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    //see the comment block above
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/full\/([0-9]{2}\.[0-9]{4}\/\([A-Z]{4}\)[A-Z]{2}\.([0-9]{4}\-[0-9]{4})\.[0-9]{6})$/.exec(path)) !== null) {
    // http://ascelibrary.org/doi/full/10.1061/(ASCE)ME.1943-5479.000279
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi = match[1];
    result.print_identifier = match[2];
//    //see the comment block above
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/pdf\/([0-9]{2}\.[0-9]{4}\/\([A-Z]{4}\)[A-Z]{2}\.([0-9]{4}\-[0-9]{4})\.[0-9]{6})$/.exec(path)) !== null) {
    // http://ascelibrary.org/doi/pdf/10.1061/%28ASCE%29ME.1943-5479.000279
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi = match[1];
    result.print_identifier = match[2];
    //see the comment block above
    result.unitid   = match[1];
  }

  return result;
});

