#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  //var url    = parsedUrl.href;
  var path   = parsedUrl.pathname;
  var match;

  //downloads de fichiers principaux
  if  ((match = /^\/(publications)\/([a-zA-Z0-9]+)\/(1)+\/(.*\.pdf)$/.exec(path)) !== null) {
    // http://ao.univ-angers.fr/publications/ua65/1/roulstone_et_al_2009_kahler_geometry_and_burgers_vortices.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[4];
  }
  // consultations de notices
  // commenté DB if ((match = /^\/(publications)\/([a-zA-Z0-9]+)$/.exec(path)) !== null) {
  else if ((match = /^\/(publications)\/([a-zA-Z0-9]+)$/.exec(path)) !== null) {
    // http://ao.univ-angers.fr/publications/ua2864
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.unitid = 'notice' + match[2];
    result.title_id = match[2];
  }
  // downloads de suppléments
  else if  ((match = /^\/(publications)\/([a-zA-Z0-9]+)\/(2)+\/(.*\.pdf)$/.exec(path)) !== null) {
    // http://ao.univ-angers.fr/publications/ua65/2/roulstone_et_al_2009_kahler_geometry_and_burgers_vortices.pdf
    result.rtype    = 'SUPP';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[4];
  }
  // consultation de pages labos
  // commenté DB   else if ((match = /^\/(laboratoires)\/([a-zA-Z0-9]+)$/.exec(path)) !== null) {
  else if ((match = /^\/(laboratoires)\/([a-zA-Z0-9]+)$/.exec(path)) !== null) {
    // http://ao.univ-angers.fr/laboratoires/biologie-neurovasculaire-mitochondriale-integree
    result.rtype  = 'LAB';
    result.unitid = match[1];
  }
  return result;
});