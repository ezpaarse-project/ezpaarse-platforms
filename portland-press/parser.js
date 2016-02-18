#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Partland Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/bj\/([0-9]+)\/([0-9]+)\/(([a-z]+)\.htm)$/.exec(path)) !== null) {
    // http://www.biochemj.org/bj/467/2/default.htm
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = 'bj';
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = 'bj'+'/'+match[1]+'/'+match[2];
  } else if ((match = /^\/bst\/([0-9]+)\/([0-9]+)\/([0-9]+)\.pdf$/.exec(path)) !== null) {
    // http://www.biochemsoctrans.org.gate1.inist.fr/bst/028/0575/0280575.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = 'bst';
    //see the comment block above
    result.unitid   = match[3];
  } else if ((match = /^\/bsr\/(([a-z]+)\.htm)$/.exec(path)) !== null) {
    //http://www.bioscirep.org./bsr/toc.htm
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = 'bsr';
    result.unitid   ='bsr';
  } else if ((match = /^\/bj\/([0-9]+)\/bj([0-9]+)\.htm$/.exec(path)) !== null) {
    //http://www.biochemj.org./bj/467/bj4670193.htm
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = 'bj';
    result.unitid   = 'bj' + match[2] ;
  } else if ((match = /^\/bsr\/([0-9]+)\/([a-z0-9]+)\/bsr([a-z0-9]+)\.htm$/.exec(path)) !== null) {
    //http://www.bioscirep.org.gate1.inist.fr/bsr/035/e182/bsr035e182.htm
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = 'bsr';
    result.unitid   = 'bsr' + match[3] ;
  } else if ((match = /^\/bst\/([0-9]+)\/([0-9]+)\/([a-z0-9]+)\.htm$/.exec(path)) !== null) {
    //http://www.biochemsoctrans.org.gate1.inist.fr/bst/042/1/default.htm?s=0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = 'bst';
    result.unitid   = 'bst' +'/'+match[1]+'/'+match[2] ;
  } else if ((match = /^\/bj\/([0-9]+)\/bj([0-9]+)([a-z]+)\.pdf$/.exec(path)) !== null) {
    //http://www.biochemj.org.gate1.inist.fr/bj/467/bj4670345ntsadd.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = 'bj'+match[2];
    result.unitid   = 'bj' +match[2] +match[3] ;
  }

  return result;
});

