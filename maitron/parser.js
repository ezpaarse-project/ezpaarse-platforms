#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme maitron
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging

  var match;

  // extraire le 1er arguement dans liste des paramétres 
  var elt;
  for (elt in param){
    //console.error(elt);
    break;
  }
  //console.error(param[0].toString());
  if ((match = /^\/(([a-z]+).php)$/.exec(path)) !== null) {
   // http://maitron-en-ligne.univ-paris1.fr.proxy.scd.univ-lille3.fr/spip.php?article170943&id_mot=9745
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

    result.title_id = elt;   
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = elt;
  } 

  return result;
});

