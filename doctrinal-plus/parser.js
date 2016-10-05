#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Doctrinal Plus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/doctrinal\/revues\/(alph|domaine)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doctrinal/revues/alph
    // http://newip.doctrinalplus.fr/doctrinal/revues/domaine
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.unitid=match[1];
  } else if ((match = /^\/doc\/doctrinal\/(notice|revue)\/([^\/]+)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/doctrinal/revue/REVDRSANITSOC
    result.rtype = 'NOTICE_T';
    if (match[1] === 'notice') {
      result.rtype = 'NOTICE_A';
    }
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doc\/fr\/(jo|code|jurisprudence)\/(([^\/]+)\/(.*))$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/jo/jorf/2014/10/29/29643924
    // http://newip.doctrinalplus.fr/doc/fr/code/securite_sociale/20120509/D412-79
    // http://newip.doctrinalplus.fr/doc/fr/jurisprudence/administrative/conseil_d_etat/376617
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[2];
    if (match[1] != 'jurisprudence') {
      result.title_id = match[3];
    } else {
      result.unitid = match[4];
      result.rtype  = 'JURISPRUDENCE';
    }
  } else if ((match = /^\/doc\/([a-z]{2})\/([a-z]+)\/(.*)$/.exec(path)) !== null) {
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
  } else if ((match = /^\/pdf\/([a-z]+)(\/([0-9]+))?$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/pdf/mono
    //pdf/notice/294431
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];
    if (match[3]) {
      result.unitid = match[3];
    }
  }

  return result;
});

