#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme europresse
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match, idElements;

  //console.error(param);

  if ((match = /^\/WebPages\/Pdf\/Document.aspx$/.exec(path)) !== null) {
    // ttp://www.bpe.europresse.com.bases-doc.univ-lorraine.fr/WebPages/Pdf/Document.aspx?DocName=pdf%c2%b720140606%c2%b7LM_p%c2%b7LIV6
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (param.DocName) {
      idElements = param.DocName.split('·');
      //console.error(idElements);
      result.title_id = idElements[2].replace('_p', '');
      result.unitid   = param.DocName;
    }
  } else if ((match = /^\/WebPages\/Search\/Doc.aspx$/.exec(path)) !== null) {
    // http://www.bpe.europresse.com.bases-doc.univ-lorraine.fr/WebPages/Search/Doc.aspx?
    // DocName=news%C2%B720140606%C2%B7ML%C2%B76225112&ContainerType=SearchResult
    //
    // http://www.bpe.europresse.com.bases-doc.univ-lorraine.fr/WebPages/Search/Doc.aspx?
    // DocName=bio%C2%B7EVI%C2%B72944&ContainerType=SearchResultBio
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (param.DocName) {
      idElements = param.DocName.split('·');
      //console.error(idElements);
      result.unitid   = param.DocName;
      if (param.ContainerType === 'SearchResult') {
        result.title_id = idElements[2].replace('_p', '');
      } else if (param.ContainerType === 'SearchResultBio') {
        result.title_id = idElements[1];
      }
    }
  }
  return result;
});

