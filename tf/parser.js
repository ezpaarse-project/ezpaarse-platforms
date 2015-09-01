#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Taylor et Francis
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

  if ((match = /^\/doi\/(full|pdf|abs)\/(([0-9\.]+)\/([0-9\.]+))$/.exec(path)) !== null) {
    //console.error(match);
     result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    //unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
    //it described the most fine-grained of what's being accessed by the user
    //it can be a DOI, an internal identifier or a part of the accessed URL
    //see http://ezpaarse.couperin.org/doc/ec-attributes.html#description-de-unitid for more details
    result.unitid = result.doi   = match[2];

    if (match[1].toUpperCase() == "FULL") {
      // http://www.tandfonline.com.bases-doc.univ-lorraine.fr/doi/full/10.1080/17400309.2013.861174#abstract
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
    } else if (match[1].toUpperCase() == "PDF") {
      // http://www.tandfonline.com:80/doi/pdf/10.1080/17400309.2013.861174      
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
    } else if (match[1].toUpperCase() == "ABS") {
      // http://www.tandfonline.com:80/doi/abs/10.1080/00039420412331273295
      result.rtype = 'ABS';
      result.mime  = 'HTML';
    }
  } else if ((match = /^\/toc\/([a-zA-Z0-9]+)\/current$/.exec(path)) !== null) {
    // http://www.tandfonline.com:80/toc/gaan20/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    //see the comment block above
    result.unitid   = match[1];
  }

  return result;
});

