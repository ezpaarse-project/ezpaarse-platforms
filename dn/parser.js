#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Dialnet
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/descarga\/articulo\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://dialnet.unirioja.es/descarga/articulo/2231656.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/servlet\/(libro|articulo)$/i.exec(path)) !== null) {
    // https://dialnet.unirioja.es/servlet/libro?codigo=593963
    // https://dialnet.unirioja.es/servlet/articulo?codigo=2231656
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = param.codigo;
  } else if ((match = /^\/servlet\/autor$/i.exec(path)) !== null) {
    // https://dialnet.unirioja.es/servlet/autor?codigo=1961635
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.codigo;
  } else if ((match = /^\/buscar\/documentos$/i.exec(path)) !== null) {
    // https://dialnet.unirioja.es/buscar/documentos?querysDismax.DOCUMENTAL_TODO=Rocks
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
