#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Europresse nouvelle plateforme
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};
  var docKeySplit = [];
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
  } else if (/^\/WebPages\/Pdf\/([a-zA-Z]+).aspx$/.test(path)) {
    //WebPages/Pdf/SearchResult.aspx?DocName=pdf%C2%B720160615%C2%B7VN_P%C2%B76228
    if (param && param.DocName) {
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
      result.unitid   = param.DocName;
      result.title_id = param.DocName.split('·')[2];
    }
  }

  return result;
});

