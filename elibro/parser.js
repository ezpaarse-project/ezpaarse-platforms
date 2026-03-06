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

  // Handle proxy URLs with eLibro URLs in query parameters
  if (parsedUrl.query && parsedUrl.query.url && parsedUrl.query.url.includes('elibro.net')) {
    const proxyUrl = parsedUrl.query.url;
    try {
      const proxyParsedUrl = new URL(proxyUrl);
      const proxyPath = proxyParsedUrl.pathname;
      // Recursively call the parser with the extracted URL
      const proxyResult = module.exports.analyseEC(proxyParsedUrl, ec);
      if (proxyResult && Object.keys(proxyResult).length > 0) {
        return proxyResult;
      }
    } catch (e) {
      // If URL parsing fails, continue with normal processing
    }
  }

  if (/^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/busqueda_avanzada$/i.test(path)) {
    // https://elibro.net/es/lc/csic/busqueda_avanzada?as_all=Negocios&as_all_op=unaccent__icontains&prev=as
    // https://elibro.net/es/lc/csic/busqueda_avanzada?as_all=Mundo&as_all_op=unaccent__icontains&prev=as
    // https://elibro-net/en/lc/ipn/busqueda_avanzada?as_all=Ciudad&as_all_op=unaccent__icontains&prev=as
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/busqueda_filtrada(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/es/lc/bibliotecaudb/busqueda_filtrada?fs_q=corto%20plazo&fs_title_type=1&fs_title_type_lb=Libro&fs_bisac_id=371;373;410&fs_bisac_id_lb=NEGOCIOS__Y__ECONOM%C3%8DA__/__General;NEGOCIOS__Y__ECONOM%C3%8DA__/__Contabilidad__/__Financiera;NEGOCIOS__Y__ECONOM%C3%8DA__/__Finanzas__/__General&prev=fs
    result.rtype    = 'FACETED_SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/titulos\/([0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/es/lc/csic/titulos/58469
    // https://elibro.net/es/lc/csic/titulos/35303
    // https://elibro.net/es/lc/bibliotecaudb/titulos/271086
    // https://elibro.net/es/lc/sibuca/titulos/130670
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/([0-9]+)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/es/ereader/bibliotecaudb/61256
    // https://elibro.net/es/ereader/csic/61699
    // https://elibro.net/es/ereader/csic/58469
    // https://elibro.net/es/ereader/bibliotecaudb/271086
    // https://elibro.net/en/ereader/sibuca/128102/?as_all=historia%20economica&as_all_op=unaccent__icontains&fs_page=3&prev=as
    // https://elibro.net/es/ereader/sibuca/43106/?page=77
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = match[3];

  } else if ((match = /^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/colecciones\/([A-Za-z0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/es/lc/ipn/colecciones/ELC004?prev=col
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/epub\/([0-9]+)$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/ipn/epub/273538?as_all=Negocios&as_all_op=unaccent__icontains&as_has_epub=true&prev=as
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/titulos\/([0-9]+)\/(data|recommendations)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/titulos/118338/data/
    // https://elibro.net/en/lc/bibliotecaudb/titulos/118338/recommendations/
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/print\/([0-9]+)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/bibliotecaudb/print/125949
    // https://elibro.net/en/ereader/bibliotecaudb/print/125949?print_id=3913254
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/log_action\/([0-9]+)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/bibliotecaudb/log_action/125949
    result.rtype    = 'FULL_TEXT_USE';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/ereader\/update_title_use\/([0-9]+)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/update_title_use/2245221/
    result.rtype    = 'FULL_TEXT_USE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/preloan\/([0-9]+)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/bibliotecaudb/preloan/125949/
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en)\/ereader\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/disponible\/([0-9]+)(?:\/.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/ereader/bibliotecaudb/disponible/125949
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if (/^\/api\/bookmarks\/(?:\?.*)?$/i.test(path)) {
    // https://elibro.net/api/bookmarks/
    // https://elibro.net/api/bookmarks/?user_id=100085&book_id=222440
    result.rtype    = 'METADATA';
    result.mime     = 'JSON';

  } else if (/^\/accounts\/login\/(?:\?.*)?$/i.test(path)) {
    // https://elibro.net/accounts/login/?next=/en/lc/bibliotecaudb/mi_perfil/qr/
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/registrar\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/registrar/?next=/en/lc/bibliotecaudb/inicio/
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/estanteria\/.*(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/estanteria/carpetas/
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/mi_perfil\/.*(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/mi_perfil/qr/
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/inicio\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/ca/lc/bibliotecaudb/inicio/
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/metadata\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/ca/lc/bibliotecaudb/metadata/
    result.rtype    = 'METADATA';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/collections\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/ca/lc/bibliotecaudb/collections/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/recent_titles\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/ca/lc/bibliotecaudb/recent_titles/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/login_usuario\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/login_usuario/?next=/en/lc/bibliotecaudb/busqueda_avanzada
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/titulos\/([0-9]+)\/tutorial_descarga\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/titulos/125949/tutorial_descarga/
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/(es|en|ca)\/lc\/(csic|ipn|sibuca|bibliotecaudb|cbues|udesa)\/ajax_preloan\/([0-9]+)\/(?:\?.*)?$/i.exec(path)) !== null) {
    // https://elibro.net/en/lc/bibliotecaudb/ajax_preloan/201777/
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  } else if ((match = /^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.exec(path)) !== null) {
    // https://elibro.net/58d25b26-1019-40b6-ab1b-505d7b653514
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid   = match[0];

  } else if (/^\/(favicon\.ico|apple-touch-icon.*\.png|bibliotecas-virtuales|lector-en-linea|libros-individuales)$/i.test(path)) {
    // https://elibro.net/favicon.ico
    // https://elibro.net/apple-touch-icon.png
    // https://elibro.net/bibliotecas-virtuales
    // https://elibro.net/lector-en-linea
    // https://elibro.net/libros-individuales
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  } else if (/^\/(en|es|ca)\/cookies\//i.test(path)) {
    // https://elibro.net/en/cookies/
    // https://elibro.net/en/cookies/modal-dialog/
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  } else if (/^\/(en|es|ca)\/a11y\//i.test(path)) {
    // https://elibro.net/en/a11y/lc/bibliotecaudb/registrar/
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  } else if (/^\/(en|es|ca)\/jsi18n\//i.test(path)) {
    // https://elibro.net/ca/jsi18n/lc/
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  }
  return result;
});

