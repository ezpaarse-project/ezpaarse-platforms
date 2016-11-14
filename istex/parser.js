#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Istex
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};
  var match;
  if (param.q) {
    result.istex_rtype = 'QUERY';
    result.rtype = 'QUERY';
    result.mime = 'JSON';
  } else if ((match = /^\/document\/([0-9A-Z]+)\/([a-z]+)\/([a-zA-Z]+)([^.]?)/.exec(path)) !== null) {
    ///document/4C46BB8FC3AE3CB005C44243414E9D0E9C8C6057/enrichments/catWos
    ///document/55420CDEEA0F6538E215A511C72E2E5E57570138/fulltext/original
    ///document/55420CDEEA0F6538E215A511C72E2E5E57570138/metadata/xml

    result.istex_rtype = match[2];

    switch (match[3]) {
    case 'txt':
      result.mime = 'TEXT';
      break;
    case 'mrc':
      result.mime = 'MARC';
      break;
    case 'catWos':
    case 'refBib':
    case 'refbib':
      result.mime = 'TEI';
      break;
    case 'original':
      result.mime = 'PDF';
      if (match[2] == 'metadata') {
        result.mime = 'XML';
      }
      break;
    default:
      result.mime = match[3].toUpperCase();
    }

    result.unitid = match[1];

  } else if ((match = /^\/document\/([0-9A-Z]{40})$/.exec(path)) !== null) {
    //https://api.istex.fr/document/5A30D5425B4E7A7A84075A5B2785BBA02FAFA3FC

    result.istex_rtype = 'metadata';
    result.unitid = match[1];
    result.mime = 'JSON';
  }

  return result;
});

