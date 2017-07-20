#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Sagaweb (normes AFNOR)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/[a-z]+-[A-Z]+\/(sw\/[a-zA-Z]+\/([a-zA-Z]+)\/[0-9]+)\/$/i.exec(path)) !== null) {
    // http://sagaweb.afnor.org/fr-FR/sw/Consultation/Xml/1265297/?lng=FR&supNumDos=FA048439
    // https://sagaweb-afnor-org.cassiope.cnam.fr/fr-FR/sw/Consultation/Pdf/1265297/?lng=FR&supNumDos=FA048439

    result.rtype  = 'STANDARD';
    result.unitid = match[1];

    switch (match[2].toLowerCase()) {
    case 'xml':
      result.mime = 'HTML';
      break;
    case 'pdf':
      result.mime = 'PDF';
      break;
    }

    if (param.supNumDos) {
      result.title_id = param.supNumDos;
    }
  }

  return result;
});

