#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform InformacionLegal
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path = parsedUrl.pathname;
  const param = parsedUrl.query || {};

  // Document access - ARTICLE/HTML with unitid from docguid
  if (/^\/maf\/app\/document$/i.test(path) && param.docguid) {
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = param.docguid;
  }
  // TOC Home - TOC/HTML with unitid from tocguid
  else if (/^\/maf\/api\/tocectoryHome$/i.test(path) && param.tocguid) {
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.tocguid;
  }
  // Search templates
  else if (/^\/maf\/api\/v1\/searchtemplates$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }
  // Search filters
  else if (/^\/maf\/app\/search\/filters\/retrieve$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }
  // Search execution
  else if (/^\/maf\/app\/search\/run\/multi$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
