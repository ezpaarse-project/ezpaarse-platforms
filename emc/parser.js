#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme EM Premium EMC
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var match;

  if ((match = /^\/produit\/(.*)$/.exec(path)) !== null) {
    //http://www.em-premium.com/produit/KI
    result.rtype    = 'BOOK_SERIES';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/showarticlefile\/([^\.]+\.pdf)$/.exec(path)) !== null) {
    //http://www.em-premium.com/showarticlefile/207594/17-50915_plus.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/traite\/([a-z]+)$/.exec(path)) !== null) {
    //http://www.em-premium.com/traite/tm
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match= /^\/article\/([0-9]+)$/.exec(path)) !== null) {
    //http://www.em-premium.com/article/867599
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});




