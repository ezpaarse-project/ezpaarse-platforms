#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Cobaz
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/notice\/norme\/([a-z0-9_-]+)\/[a-z0-9_.-]+$/i.exec(path)) !== null) {
    // /notice/norme/nf-iso-20397-2/FA199691?rechercheID=1704579&searchIndex=1&activeTab=all#id_lang_1_descripteur
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/recherche-resultat$/i.test(path)) {
    // /recherche-resultat?rechercheID=1704740&_=1622711161804
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
