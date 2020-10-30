#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme maitron
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const params = parsedUrl.query || {};


  if (params.page === 'recherche_avanc') {
    // /spip.php?page=recherche_avanc&swishe_type=and&swishe_from%5B%5D=full&lang=fr&choix=2&swishe_exp=michel&OK=OK
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
    return result;
  }

  const articleRegex = /^article[0-9]+$/;
  const articleId = Object.keys(params).find(param => articleRegex.test(param));

  if (articleId) {
    // /spip.php?article218537
    result.rtype  = 'BIO';
    result.mime   = 'HTML';
    result.unitid = articleId;
  }
  return result;
});
