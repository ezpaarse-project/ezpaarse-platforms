#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme europresse
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};

  let idElements;


  if (/^\/WebPages\/Pdf\/Document.aspx$/i.test(path)) {
    // http://www.bpe.europresse.com.bases-doc.univ-lorraine.fr/WebPages/Pdf/Document.aspx?DocName=pdf%c2%b720140606%c2%b7LM_p%c2%b7LIV6
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    if (param.DocName) {
      idElements = param.DocName.split('·');

      result.title_id = idElements[2].replace('_p', '');
      result.unitid   = param.DocName;
    }
  } else if (/^\/WebPages\/Search\/Doc.aspx$/i.test(path)) {
    // http://www.bpe.europresse.com.bases-doc.univ-lorraine.fr/WebPages/Search/Doc.aspx?
    // DocName=news%C2%B720140606%C2%B7ML%C2%B76225112&ContainerType=SearchResult
    //
    // http://www.bpe.europresse.com.bases-doc.univ-lorraine.fr/WebPages/Search/Doc.aspx?
    // DocName=bio%C2%B7EVI%C2%B72944&ContainerType=SearchResultBio
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.DocName) {
      idElements = param.DocName.split('·');
      result.unitid = param.DocName;

      if (param.ContainerType === 'SearchResult') {
        result.title_id = idElements[2].replace('_p', '');
      } else if (param.ContainerType === 'SearchResultBio') {
        result.title_id = idElements[1];
      }
    }
  } else if (/^\/Pdf\/ImageList$/i.test(path)) {
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';

    if (param.docName) { result.unitid = decodeURIComponent(param.docName); }
  }
  return result;
});

