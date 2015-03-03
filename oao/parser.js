#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Oxford Art Online (Grove, Benezit et 3 autres)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/subscriber\/article\/grove\/art\/([TF][0-9]+)$/.exec(path)) !== null) {
    // Grove Art Online
    // http://www.oxfordartonline.com/subscriber/article/grove/art/T000015
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = 'grove';
    result.unitid   = match[1];
  } else if ((match = /^\/subscriber\/article\/benezit\/(.+)$/.exec(path)) !== null) {
    // Benezit
    // http://www.oxfordartonline.com/subscriber/article/benezit/B00088821
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = 'benezit';
    result.unitid   = match[1];
  } else if ((match = /^\/subscriber\/article\/opr\/(t4|t234|t118)\/(.+)$/.exec(path)) !== null) {
    // http://www.oxfordartonline.com/subscriber/article/opr/t118/e2515 (The Oxford Companion to Western Art)
    // http://www.oxfordartonline.com/subscriber/article/opr/t4/e1014 (The Concise Oxford Dictionary of Art Terms)
    // http://www.oxfordartonline.com/subscriber/article/opr/t234/e0287 (Encyclopedia of Aesthetics)
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/subscriber\/(article|popup_fig)\/img\/grove\/art\/([F][0-9]+)$/.exec(path)) !== null) {
    // Grove Art Online : accès à la page d'une image, à l'image
    // http://www.oxfordartonline.com/subscriber/article/img/grove/art/F017567
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = 'grove';
    result.unitid   = match[2];
  } else if ((match = /^\/subscriber\/article\/img\/opr\/(t4|t234|t118)\/(.+)$/.exec(path)) !== null) {
    // Encyclopedia of Aesthetics : accès à une image
    // http://www.oxfordartonline.com/subscriber/article/img/opr/t234/0195113071_abstraction_2
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});

