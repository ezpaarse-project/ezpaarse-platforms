#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Techniques de l'Ingénieur
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/actualite\/(.+)\/$/.exec(path)) !== null) {
    // https://www.techniques-ingenieur.fr/actualite/les-led-remplaceront-elles-les-halogenes-en-2016-article_293406/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/base\-documentaire\/[a-z\-]+(th[0-9]+)\/[a-z\-]+([0-9]+)\/[a-z\-]+\-([a-z0-9]+)\/$/.exec(path)) !== null) {
    // https://www.techniques-ingenieur.fr/base-documentaire/sciences-fondamentales-th8/mathematiques-fondamentales-analyse-42103210/topologie-et-mesure-af99/
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
    //console.error(match[1] + "-" + match[2] + "-" + match[3]);
    result.title_id = match[2];
    result.unitid   = match[1] + "-" + match[2] + "-" + match[3];
  } else if ((match = /^\/res\/pdf\/encyclopedia\/([0-9]+)\-([a-z0-9]+)\.pdf$/.exec(path)) !== null) {
    // https://www.techniques-ingenieur.fr/res/pdf/encyclopedia/42103210-af99.pdf
    // unitid 42103210-af99
    result.unitid = match[1] + "-" + match[2];
    result.title_id = match[1];
    // titleid 42103210
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
  } else if ((match = /^\/confirm-download\/$/.exec(path)) !== null) {
    // http://www.techniques-ingenieur.fr/confirm-download/?irId=10626-707219290ce4e891ec22f97a720b0a8c&type=WP&wpId=whitepaper85
    result.rtype = 'BOOK';
    result.mime  = 'PDF';
    result.unitid = param['wpId'];
    result.title_id = param['wpId']; 
  } else if ((match = /^\/lexique\/([a-z0-9\-]+)\.html$/.exec(path)) !== null) {
    // http://www.techniques-ingenieur.fr/lexique/materiel-24227.html
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime  = 'HTML';
    result.unitid = 'lexique/' + match[1];
    result.title_id  = match[1];
  } else if ((match = /^\/base\-documentaire\/archives\-th[0-9]+\/[a-z\-0-9]+\/archive\-[0-9]\/([a-z0-9\-]+)\/$/.exec(path)) !== null) {
    // http://www.techniques-ingenieur.fr/base-documentaire/archives-th12/archives-mathematiques-pour-l-ingenieur-tiafm/archive-1/classification-periodique-des-elements-25/
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
    //console.error(match[1] + "-" + match[2] + "-" + match[3]);
    result.title_id = match[1];
    result.unitid   = match[1];
  } 

  return result;
});

