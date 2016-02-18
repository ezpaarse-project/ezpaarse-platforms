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
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/doctrinal\/revues\/(alph|domaine)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doctrinal/revues/alph
    // http://newip.doctrinalplus.fr/doctrinal/revues/domaine
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid=match[1];
  } else if ((match = /^\/doc\/doctrinal\/revue\/([^\/]+)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/doctrinal/revue/REVDRSANITSOC
    result.rtype    = 'NOTICE_T';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/doc\/doctrinal\/notice\/([^\/]+)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/doctrinal/notice/379663
    result.rtype    = 'NOTICE_A';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/doc\/fr\/(jo|code)\/(([^\/]+)\/.*)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/jo/jorf/2014/10/29/29643924
    // http://newip.doctrinalplus.fr/doc/fr/code/securite_sociale/20120509/D412-79
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[3];
    result.unitid   = match[2];
  } else if ((match = /^\/doc\/fr\/texte\/(.*)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/texte/arrete/IOCC1134994A?nop=1&search_id=e3ae7ac8108a5a9eceff342146f1a10b&idx=9
    result.rtype    = 'ARRETE';
    result.mime     = 'HTML';
    //result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/doc\/fr\/jurisprudence\/([^\/]+)\/(.*)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/jurisprudence/judiciaire/cour_de_cassation/C1405857
    // http://newip.doctrinalplus.fr/doc/fr/jurisprudence/administrative/conseil_d_etat/376617
    // ?nop=1&search_id=526775a59652bcac5f1df78d149d3741&idx=0
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    //result.title_id = match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doc\/fr\/assemblees\/(.*)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/fr/assemblees/se/qSEQ090307701?
    // nop=1&search_id=a3c7f66be34266e70b34dc7787387a9c&idx=62420
    result.rtype    = 'ASSEMBLEE';
    result.mime     = 'HTML';
    //result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/doc\/eu\/celex\/(.*)$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/doc/eu/celex/1/2008/M/PRO_03?
    // nop=1&search_id=058256217ade3971336b3224bafc7ef8&idx=0
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/pdf\/mono$/.exec(path)) !== null) {
    // http://newip.doctrinalplus.fr/pdf/mono
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    //result.title_id = match[2];
    result.unitid   = 'mono';
  }

  return result;
});

