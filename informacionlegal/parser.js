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
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let hostname = parsedUrl.hostname;

  // use console.error for debugging
  // console.error(parsedUrl);

  let match;

  // Handle publisher domain only
  if (hostname && hostname.includes('informacionlegal.com.ar')) {
    
    // Document access - ARTICLE/HTML with unitid from docguid
    if ((match = /^\/maf\/app\/document$/i.exec(path)) !== null && param.docguid) {
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = param.docguid;
    } 
    
    // TOC Home - TOC/HTML with unitid from tocguid
    else if ((match = /^\/maf\/api\/tocectoryHome$/i.exec(path)) !== null && param.tocguid) {
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.unitid   = param.tocguid;
    } 
    
    // Search templates
    else if ((match = /^\/maf\/api\/v1\/searchtemplates$/i.exec(path)) !== null) {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    } 
    
    // Search filters
    else if ((match = /^\/maf\/app\/search\/filters\/retrieve$/i.exec(path)) !== null) {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    }
    
    // Search execution
    else if ((match = /^\/maf\/app\/search\/run\/multi$/i.exec(path)) !== null) {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    }
  }

  return result;
}); 
