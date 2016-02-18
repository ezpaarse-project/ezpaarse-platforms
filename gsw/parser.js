#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme GeoScienceWorld
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var hostname = parsedUrl.hostname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);


  var match;

  if ((match = /^\/content\/([0-9]+)\/([0-9\-]+)\/(([0-9]+)\.(abstract|full|full\.pdf))(\+html)?$/.exec(path)) !== null) {
    /* http://ammin.geoscienceworld.org.biblioplanets.gate.inist.fr/content/100/8-9/1728.full.pdf+html
    * http://rimg.geoscienceworld.org.biblioplanets.gate.inist.fr/content/68/1/345.full.pdf+html
    *http://rimg.geoscienceworld.org.biblioplanets.gate.inist.fr/content/68/1/345.ful
    *
    */

    result.title_id = hostname.split('.')[0];
    result.unitid   = match[1] +'/'+match[2]+'/'+match[4];
    result.vol  = match[1];
    result.issue = match[2];
    result.first_page = match[4];
    switch (match[5]) {
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'MISC';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'full.pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  } else if ((match = /^\/content\/([0-9]+)\/(([0-9]+)\.(toc))$/.exec(path)) !== null) {
    // http://aapgbull.geoscienceworld.org.biblioplanets.gate.inist.fr/content/97/1.toc
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = hostname.split('.')[0];
    result.unitid   = match[1] +'/'+match[3];
    result.vol  = match[1];
    result.issue = match[3];

  }

  return result;
});

