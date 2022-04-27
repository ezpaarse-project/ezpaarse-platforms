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
  let docKeySplit = [];
  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/Document\/([a-zA-Z]+)$/.test(path)) {
    // /Document/ViewMobile?docKey=news·20160417·PJW·00842897&fromBasket=false
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param && param.docKey) {
      docKeySplit     = param.docKey.split('·');
      result.unitid   = param.docKey;
      result.title_id = docKeySplit[2];
      if (docKeySplit[0] === 'web' || docKeySplit[0] === 'report') {
        result.rtype = 'REF';
      }
    }

  } else if (/^\/PDF\/([a-zA-Z]+)$/.test(path)) {
    // /PDF/Document?docName=pdf.20160419·LM_P·10
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    if (param && param.docName) {
      result.unitid   = param.docName;
      result.title_id = param.docName.split('·')[1];
    }
  } else if (/^\/WebPages\/Pdf\/(Document|SearchResult).aspx$/i.test(path)) {
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
    // /Pdf/ImageList?docName=pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';

    if (param.docName) { result.unitid = decodeURIComponent(param.docName); }
  } else if (/^\/Search\/ResultMobile$/i.test(path)) {
    // /Search/ResultMobile
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }
  return result;
});

