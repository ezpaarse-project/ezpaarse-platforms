#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Doctrinal Plus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/doctrinal\/revues\/(alph|domaine)$/i.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doctrinal/revues/alph
    // http://newip.doctrinalplus.fr/doctrinal/revues/domaine
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/doc\/doctrinal\/(notice|revue)\/([^/]+)$/i.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/doctrinal/revue/REVDRSANITSOC
    result.mime     = 'HTML';
    result.rtype    = 'RECORD_VIEW';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/doc\/fr\/(jo|code|jurisprudence)\/(([^/]+)\/(.*))$/i.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/jo/jorf/2014/10/29/29643924
    // http://newip.doctrinalplus.fr/doc/fr/code/securite_sociale/20120509/D412-79
    // http://newip.doctrinalplus.fr/doc/fr/jurisprudence/administrative/conseil_d_etat/376617
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[2];

    if (match[1] === 'jurisprudence') {
      result.unitid = match[4];
      result.rtype  = 'JURISPRUDENCE';
    } else {
      result.title_id = match[3];
    }
  } else if ((match = /^\/doc\/([a-z]{2})\/([a-z]+)\/(.*)$/i.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/assemblees/se/qSEQ090307701?
    // nop=1&search_id=a3c7f66be34266e70b34dc7787387a9c&idx=62420
    result.rtype = 'ASSEMBLEE';

    if (match[1] === 'eu') {
      result.rtype = 'ARTICLE';
    }
    if (match[2] === 'texte') {
      result.rtype = 'ARRETE';
    }
    result.mime   = 'HTML';
    result.unitid = match[3];
  } else if ((match = /^\/pdf\/([a-z]+)(\/([0-9]+))?$/i.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/pdf/mono
    // /pdf/notice/294431
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];

    if (match[3]) {
      result.unitid = match[3];
    }
  } else if ((match = /^\/(search_(mono|multi)|doctrinal)\/results$/i.exec(path)) !== null) {
    // /search_mono/results
    // /search_multi/results
    // /doctrinal/results
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  } else if ((match = /^\/revue-[a-z-]+\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /revue-juridique/GAZPAL-la-gazette-du-palais
    result.rtype  = 'RECORD';
    result.mime   = 'HTML';
    result.unitid = match[1];

  }  else if ((match = /^\/recherche-[a-z-]+$/i.exec(path)) !== null) {
    // /recherche-notices-juridiques
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  }

  return result;
});

