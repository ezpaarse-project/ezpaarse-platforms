#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ZentralBlatt
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

  if ((match = /^\/pdf\/([0-9\.]+)\.pdf$/.exec(path)) !== null) {
    // https://zbmath.org/pdf/06497268.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[1];
  } else if ((match = /^\/xml\/([0-9\.]+)\.xml$/.exec(path)) !== null) {
    // https://zbmath.org/xml/06497268.xml
    result.rtype    = 'REF';
    result.mime     = 'XML';
    //see the comment block above
    result.unitid   = match[1];
  } else if ((match = /^\/bibtex\/([0-9\.]+)\.bib$/.exec(path)) !== null) {
    // https://zbmath.org/bibtex/06497268.bib
    result.rtype    = 'REF';
    result.mime     = 'BIBTEX';
    //see the comment block above
    result.unitid   = match[1];
  }

  return result;
});

