#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Dalloz Revues
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

  if ((match = /^\/((.+)-cover-[0-9]+)\.htm$/.exec(path)) !== null) {
    // https://www.dalloz-revues.fr/RDSS-cover-46836.htm
    // http://www.dalloz-revues.fr/AJ_Contrats_d_affaires___Concurrence___Distribution-cover-47964.htm
    // http://www.dalloz-revues.fr/Dalloz_Avocats___Exercer_et_entreprendre-cover-47750.htm
    // http://www.dalloz-revues.fr/Juris_associations-cover-48224.htm
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/fr\/pvFlash.asp$/.exec(path)) !== null) {
    // http://dallozknd-pvgpsla5.dalloz-revues.fr/fr/pvFlash.asp?swf=/data1/004890/201505/00001_661b3edf4239fadb4c6ab1eefc42c42a.wfl&version=1&pub=004890&num=201505&pag=1&mode=swr
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    //unitid: 004890-201505-1
    //title_id: 004890
    result.title_id = param['pub'];
    result.unitid   = param['pub'] + '-' + param['num'] + '-' + param['pag'];
  }

  return result;
});

