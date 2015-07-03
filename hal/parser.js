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
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/file\/index\/docid\/0*([0-9]+)\/filename\/[^\/]+.pdf$/.exec(path)) !== null) {
    // http://hal.archives-ouvertes.fr/file/index/docid/544258/filename/jafari_Neurocomp07.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z]+\-0*([0-9]+)(?:v[0-9]+)?\/?(document)?$/.exec(path)) !== null) {
    // http://hal.archives-ouvertes.fr/hal-01085760/document
    // http://hal.archives-ouvertes.fr/hal-00137415/
    result.rtype    = match[2] ? 'ARTICLE' : 'ABS';
    result.mime     = match[2] ? 'PDF' : 'HTML';
    result.title_id = match[1];
    //see the comment block above
    result.unitid   = match[1];
  } else if ((match = /^\/[a-zA-Z-0-9]+\/[a-z]+\-0*([0-9]+)(?:v[0-9]+)?\/?$/.exec(path)) !== null) {
    // http://hal.archives-ouvertes.fr/IRMAR-AN/hal-01017106v1
    // http://hal.archives-ouvertes.fr/U835/hal-00875271v

    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    //see the comment block above
    result.unitid   = match[1];
  }

  return result;
});

