#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Sagaweb (normes AFNOR)
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

  if ((match = /^\/([a-z]+\-[A-Z]+)\/(sw)\/([a-zA-Z]+)\/([a-zA-Z]+)\/([0-9]+)\/$/.exec(path)) !== null) {
    // http://sagaweb.afnor.org/fr-FR/sw/Consultation/Xml/1265297/?lng=FR&supNumDos=FA048439
    //https://sagaweb-afnor-org.cassiope.cnam.fr/fr-FR/sw/Consultation/Pdf/1265297/?lng=FR&supNumDos=FA048439

    result.rtype    = 'STANDARD';
    if (match[4] === 'Xml') {
      result.mime     = 'HTML';
    } else if (match[4]=== 'Pdf') {
      result.mime     = 'PDF';
    }
    if (param.supNumDos) {
      result.title_id = param.supNumDos;
    }

    result.unitid   = match[2]+'/'+ match[3]+'/'+ match[4]+'/'+ match[5];
  }
  //(([a-z]+)-([A-Z]+))\/sw\/([a-zA-Z]+)\/([0-9]+)

  return result;
});

