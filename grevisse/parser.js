#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Bon Usage Grevisse
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
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  //console.error(parsedUrl);
  result.title_id = hostname;

  var match;

  if ((match = /^\/document\/([^\/]+)$/.exec(path)) !== null) {
    // http://www.lebonusage.com/document/p2ch3-80831
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[1];
  } else if ((match = /^\/compare\/recherche\/([^\/]+)/.exec(path)) !== null) {
    // http://www.lebonusage.com/compare/recherche/p1ch2-31609/p2ch8-161255/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //see the comment block above
    result.unitid   = match[1];
  } else if ((match = /^\/imprime$/.exec(path)) !== null) {
    // hhttp://www.lebonusage.com/imprime
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }
  // override HTML default if PDF download requested
  if (parsedUrl.hash && parsedUrl.hash === '#pdfBox') { result.mime = 'PDF';}
  return result;
});

