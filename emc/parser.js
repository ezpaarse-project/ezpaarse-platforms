#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme EM Premium EMC
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/produit\/(.*)$/.exec(path)) !== null) {
    // http://www.em-premium.com/produit/KI
    result.rtype    = 'BOOK_SERIES';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/showarticlefile\/([^.]+\.pdf)$/.exec(path)) !== null) {
    // http://www.em-premium.com/showarticlefile/207594/17-50915_plus.pdf
    // http://www.em-premium.com/showarticlefile/56352/main.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/traite\/([a-z]+)\/?$/.exec(path)) !== null) {
    //http://www.em-premium.com/traite/tm
    result.rtype = 'TOC';
    result.mime = 'MISC';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/revue\/([a-z]+(\/\d+){0,2})\/?$/.exec(path)) !== null) {
    // http://www.em-premium.com/revue/annchi/131/10(/)
    // http://www.em-premium.com/revue/annchi/131(/)
    // http://www.em-premium.com/revue/annchi(/)
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/article\/([0-9]+)$/.exec(path)) !== null) {
    // http://www.em-premium.com/article/867599
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/article\/([0-9]+\/iconosup(\/fig[1-9]+)?)$/.exec(path)) !== null) {
    // http://www.em-premium.com/article/261151/iconosup/fig3
    result.rtype  = 'IMAGE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});