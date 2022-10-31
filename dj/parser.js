#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL    = require('url');

/**
 * Recognizes the accesses to the platform Dejure
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  const hash = parsedUrl.hash.replace('#', '');
  const hashedUrl = URL.parse(hash, true);
  const path = hashedUrl.pathname;
  let param = hashedUrl.query || {};

  if (/^\/ricerca\/giurisprudenza_lista_risultati$/i.test(path)) {
    // https://dejure.it/#/ricerca/giurisprudenza_lista_risultati?isCorrelazioniSearch=false
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/ricerca\/[a-z_]+$/i.test(path)) {
    // https://dejure.it/#/ricerca/giurisprudenza_documento_massime?idDatabank=0&idDocMaster=10062620&idUnitaDoc=0&nVigUnitaDoc=1&docIdx=0&semantica=0&isPdf=false&fromSearch=false&isCorrelazioniSearch=false
    // https://dejure.it/#/ricerca/fonti_documento?idDatabank=7&idDocMaster=3948531&idUnitaDoc=20129755&nVigUnitaDoc=1&isCorrelazioniSearch=true
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    if (param.idDocMaster) {
      result.unitid   = param.idDocMaster;
    } else if (param.idUnitaDoc) {
      result.unitid   = param.idDocMaster;
    }
  }

  return result;
});
