#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform BiASA
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

  if (/^\/visualizzatore\.aspx$/i.test(path)) {
    // http://periodici.librari.beniculturali.it/visualizzatore.aspx?anno=1884-1885-1886&id_immagine=52997098&id_periodico=15211&id_testata=3
    result.rtype    = 'BOOK_PAGE';
    result.mime     = 'HTML';
    result.pii = param.id_periodico;
    result.unitid = param.id_immagine;

  } else if (/^\/PeriodicoScheda\.aspx$/i.test(path)) {
    // http://periodici.librari.beniculturali.it/PeriodicoScheda.aspx?id_testata=3&Start=0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/RicercaAvanzata\.aspx$/i.test(path)) {
    // http://periodici.librari.beniculturali.it/RicercaAvanzata.aspx?cercato=Archeologia
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
