#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Cold spring Harbor Laboratory Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var hostname = parsedUrl.hostname;
  var match;

  if ((match = /^\/content\/([0-9]+)\/([0-9\-]+)\/(([a-z0-9]+)\.(abstract|full|full\.pdf))(\+html)?$/.exec(path)) !== null) {
    //http://cshperspectives.cshlp.org.gate1.inist.fr/content/7/9/a015719.full.pdf+html
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
    result.title_id = hostname.split('.')[0];
    result.unitid   = match[4];
    result.vol  = match[1];
    result.issue = match[2];
    result.doi = '10.1101/cshperspect' + '.' + match[4]; 
  
  } 

  return result;
});

