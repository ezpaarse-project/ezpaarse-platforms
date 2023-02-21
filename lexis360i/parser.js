#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lexis360Intelligence
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/api\/document\/records\/([A-Z0-9_-]+)\/pdf$/i.exec(path)) !== null) {
    // /api/document/records/EN_KEJC-215487_0KSS/pdf
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/api\/recherche\/\/search$/i.exec(path)) !== null) {
    // /api/recherche//search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/encyclopedies\/JurisClasseur_Rural\/([A-Z0-9_-]+)\/document\/([A-Z0-9_-]+)$/i.exec(path)) !== null) {
    // /encyclopedies/JurisClasseur_Rural/RU0-TOCID/document/EN_KEJC-215487_0KSS
    // ?q=droit%20travail&doc_type=doctrine_fascicule
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.unitid = match[2];

  }

  return result;
});
