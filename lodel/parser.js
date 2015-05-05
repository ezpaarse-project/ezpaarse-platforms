#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Irevues : partie LODEL
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
  //console.error(parsedUrl);

  var match;

  if ((match = /^\/(([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\/]+\.pdf))$/.exec(path)) !== null) {
    // http://lodel.irevues.inist.fr/saintjacquesinfo/docannexe/file/970/boheme.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid   = match[1];
  } else if ((match = /^\/([a-zA-Z0-9\-]+)\/$/.exec(path)) !== null) {
    // http://lodel.irevues.inist.fr/oeiletphysiologiedelavision/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    //see the comment block above
    result.unitid   = match[1];
  } else if ((match = /^\/([a-zA-Z0-9\-]+)\/index.php$/.exec(path)) !== null) {
    // ttp://lodel.irevues.inist.fr/saintjacquesinfo/index.php?id=1088
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (param.id) { 
      //see the comment block above
      result.unitid   = match[1] + '/' + param.id;
    }
    result.title_id = match[1];
  }

  return result;
});

