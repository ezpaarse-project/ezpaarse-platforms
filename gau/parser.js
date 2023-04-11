#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Gazzetta Ufficiale
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/[a-z]+\/[a-z]+\/(\d{4})\/(\d{2})\/(\d{2})\/(\d+)\/([a-z]+)\/pdf$/i.exec(path)) !== null) {
    // http://www.gazzettaufficiale.it/eli/gu/2023/01/09/6/sg/pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[5];
    result.publication_date = match[1] + '-' + match[2] + '-' + match[3];
    result.first_page = match[4];

  } else if ((match = /^\/atto\/serie_generale\/caricaDettaglioAtto\/originario$/i.exec(path)) !== null) {
    // https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=2023-01-09&atto.codiceRedazionale=22A07425&elenco30giorni=true
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param['atto.codiceRedazionale'];
    result.publication_date = param['atto.dataPubblicazioneGazzetta'];
  }

  return result;
});
