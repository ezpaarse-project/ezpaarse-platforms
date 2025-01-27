#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform eLibro.net
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/(es|en)\/lc\/(csic|ipn)\/busqueda_avanzada$/i.test(path)) {
    // https://elibro.net/es/lc/csic/busqueda_avanzada?as_all=Negocios&as_all_op=unaccent__icontains&prev=as
    // https://elibro.net/es/lc/csic/busqueda_avanzada?as_all=Mundo&as_all_op=unaccent__icontains&prev=as
    // https://elibro-net/en/lc/ipn/busqueda_avanzada?as_all=Ciudad&as_all_op=unaccent__icontains&prev=as
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/es\/lc\/(csic|bibliotecaudb)\/titulos\/([0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/es/lc/csic/titulos/58469
    // https://elibro.net/es/lc/csic/titulos/35303
    // https://elibro.net/es/lc/bibliotecaudb/titulos/271086
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/es\/ereader\/(csic|bibliotecaudb)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/es/ereader/bibliotecaudb/61256
    // https://elibro.net/es/ereader/csic/61699
    // https://elibro.net/es/ereader/csic/58469
    // https://elibro.net/es/ereader/bibliotecaudb/271086
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = match[2];

  } else if ((match = /^\/es\/lc\/ipn\/colecciones\/([A-Za-z0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/es/lc/ipn/colecciones/ELC004?prev=col
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/en\/ereader\/ipn\/epub\/([0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/ipn/epub/273538?as_all=Negocios&as_all_op=unaccent__icontains&as_has_epub=true&prev=as
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.unitid = match[1];

  }
  return result;
});
