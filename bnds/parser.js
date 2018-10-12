#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bibliothèque numérique de Droit de la Santé et d'éthique médicale
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (param.action == 'consultationhtml') {
    // https://www.bnds.fr/?action=consultationhtml&contenu=946#
    result.unitid = param.contenu;
    result.rtype  = 'OTHER';
    result.mime   = 'HTML';
  } else if ((match = /^\/espacetelechargement\.html/i.exec(path)) !== null) {
    // https://www.bnds.fr/espacetelechargement.html?contenu=5205&format=pdf
    result.rtype    = 'OTHER';
    result.mime     = 'PDF';
    result.unitid   = param.contenu;
  } else if ((match = /^\/liseuse\//i.exec(path)) !== null) {
    // https://www.bnds.fr/liseuse/?contenu=3993
    result.rtype    = 'OTHER';
    result.mime     = 'MISC';
    result.unitid   = param.contenu;
  } else if ((match = /^\/revue\/([a-z]+)\/([a-z-\d]+)\.html/i.exec(path)) !== null) {
    // https://www.bnds.fr/revue/rss/rss-34.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/collection\/([a-z-]+)\/[a-z-]+(\d{13})\.html/i.exec(path)) !== null) {
    // https://www.bnds.fr/collection/tout-savoir-sur/hygiene-alimentaire-en-restauration-collective-grace-a-l-assurance-qualite-haccp-9782848745138.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
    result.online_identifier = match[2];
  } else if ((match = /^\/revue\/([a-z]+)\/[a-z-\d]+\/[a-z-]+(\d+)\.html/i.exec(path)) !== null) {
    // https://www.bnds.fr/revue/rgdm/rgdm-47/reflexions-a-propos-du-jugement-des-irradies-d-epinal-4454.html
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/recherche.php/i.exec(path)) !== null) {
    // https://www.bnds.fr/recherche.php?mcr=infractions
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
