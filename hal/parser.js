#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme HAL - Archives Ouvertes
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/file\/index\/docid\/0*([0-9]+)\/filename\/[^/]+.pdf$/i.exec(path)) !== null) {
    // http://hal.archives-ouvertes.fr/file/index/docid/544258/filename/jafari_Neurocomp07.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/[a-z]+-0*([0-9]+)(?:v[0-9]+)?\/?(document)?$/i.exec(path)) !== null) {
    // http://hal.archives-ouvertes.fr/hal-01085760/document
    // http://hal.archives-ouvertes.fr/hal-00137415/
    result.rtype    = match[2] ? 'ARTICLE' : 'ABS';
    result.mime     = match[2] ? 'PDF' : 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/[a-zA-Z-0-9]+\/[a-z]+-0*([0-9]+)(?:v[0-9]+)?\/?$/i.exec(path)) !== null) {
    // http://hal.archives-ouvertes.fr/IRMAR-AN/hal-01017106v1
    // http://hal.archives-ouvertes.fr/U835/hal-00875271v

    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});

