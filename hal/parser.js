#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme HAL - Archives Ouvertes
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.path;
  let match;

  if ((match = /^\/file\/index\/(docid|identifiant)\/(([a-z]+-)?0*([0-9]+))_?(v[0-9]+)?\/filename\/[^\/]+.pdf$/i.exec(path)) !== null) {
    //Accès à un document
    // /file/index/docid/544258/filename/jafari_Neurocomp07.pdf
    result.rtype    = 'FULLTEXT';
    result.mime     = 'PDF';

    if (match[1].toUpperCase() == 'DOCID') {
      result.hal_docid = match[2];
    } else {
        result.hal_identifiant = match[2];
    }

  } else if ((match = /^\/?([A-Z-0-9]+)?\/docs\/([0-9]{2})\/([0-9]{2})\/([0-9]{2})\/([0-9]{2})\/PDF\/[^\/]+.pdf$/i.exec(path)) !== null) {
      //Accès à un document
      // /docs/00/16/73/06/PDF/these.pdf

      // COLLECTION
      result.hal_collection = match[1];

      result.rtype    = 'FULLTEXT';
      result.mime     = 'PDF';

      let debut = match[2];

      if (debut == '00') {
          debut = '';
      } else {
          debut = '1';
      }

      result.hal_docid = debut + match[3] + match[4] + match[5];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/([a-z]+-0*([0-9]+))_?(v[0-9]+)?\/PDF\/[^\/]+.pdf$/i.exec(path)) !== null) {
      //Accès à un document
      // /hal-00987395/PDF/article.pdf

      // COLLECTION
      result.hal_collection = match[1];

      result.rtype    = 'FULLTEXT';
      result.mime     = 'PDF';

      result.hal_identifiant = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/([a-z]+-0*([0-9]+))_?(v[0-9]+)?\/?(document|image|video|player)?\/?$/i.exec(path)) !== null) {
      //Accès à un document ou à une notice sans collection (avec et sans versions)
      // /hal-01085760/document
      // /hal-01085760/image
      // /hal-01085760/video
      // /hal-01085760/player
      // /hal-00137415/
      // Avec une collection pour toutes les URLS ci-dessus : /COL/hal-00137415/

      // COLLECTION
      result.hal_collection = match[1];

      result.rtype    = match[5] ? 'FULLTEXT' : 'NOTICE';
      result.mime     = match[5] ? 'PDF' : 'HTML';
      result.hal_identifiant = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/([a-z]+-0*([0-9]+))_?(v[0-9]+)?\/?(fr|en|eu|es)?\/?$/i.exec(path)) !== null) {
    //Accès à un document ou à une notice sans collection (avec et sans versions)
    // /hal-00137415/en
    // Avec une collection pour toutes les URLS ci-dessus : /COL/hal-00137415/

    // COLLECTION
    result.hal_collection = match[1];

    result.rtype    = 'NOTICE';
    result.mime     = 'HTML';
    result.hal_identifiant = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/([a-z]+-0*([0-9]+))_?(v[0-9]+)?\/(bibtex|tei|dc|dcterms|endNote|rdf)\/?$/i.exec(path)) !== null) {
      /** Accès à une notice dans un format d'export
       /hal-00137415/tei
       */

      // COLLECTION
      result.hal_collection = match[1];

      result.rtype    = 'EXPORT';
      result.mime     = match[5].toUpperCase();
      result.hal_identifiant = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/view\/index(\/|\?)(docid|identifiant)(\/|=)(([a-z]+-)?0*([0-9]+))_?(v[0-9]+)?\/?$/i.exec(path)) !== null) {
    // Accès à une notice HTML (avec et sans versions) (avec et sans collections)
    // /view/index/docid/1302902
    // /view/index?docid=1302902
    // /view/index/identifiant/hal-01302902
    // /view/index/identifiant/hal-01302902v2
    // /view/index?identifiant=hal-01302902
    // /view/index?identifiant=hal-01302902v2
    // Avec une collection pour toutes les URLS ci-dessus : /COL/hal-00137415/

    // COLLECTION
    result.hal_collection = match[1];

    result.rtype    = 'NOTICE';
    result.mime     = 'HTML';

    if (match[3].toUpperCase() == 'DOCID') {
        result.hal_docid = match[5];
    } else {
        result.hal_identifiant = match[5];
    }
  } else if ((match = /^\/?([A-Z-0-9]+)?\/file\/index(\/|\?)(docid|identifiant)(\/|=)(([a-z]+-)?0*([0-9]+))_?(v[0-9]+)?((\/|\&)fileid(\/|=)1)?(\/|\&)main(\/|=)(1|true)\/?$/i.exec(path)) !== null) {

    //Accès à un document (avec et sans versions) (avec et sans collections)
    // /file/index/docid/1302902/main/1
    // /file/index/identifiant/hal-01302902/main/1
    // /file/index?docid=1302902&main=1
    // /file/index?identifiant=hal-01302902&main=1
    // /file/index/docid/1302902/fileid/1/main/1
    // /file/index?docid/1302902&fileid=1&main=1
    // /file/index/identifiant/hal-01302902/fileid/1/main/1
    // /file/index?identifiant=hal-01302902&fileid=1&main=1

    // COLLECTION
    result.hal_collection = match[1];

    result.rtype    = 'FULLTEXT';
    result.mime     = 'PDF';

    if (match[3].toUpperCase() == 'DOCID') {
        result.hal_docid = match[5];
    } else {
        result.hal_identifiant = match[5];
    }
    
  } else if ((match = /^\/?([A-Z0-9\-]+)?\/(([a-z]+-)?0*([0-9]+))_?(v[0-9]+)?\/file\/[^/]+.pdf$/i.exec(path)) !== null) {
    //Accès à un document (avec et sans versions) (avec et sans collections)
    // /hal-00137415/file/jafari_Neurocomp07.pdf

    // COLLECTION
    result.hal_collection = match[1];

    result.rtype    = 'FULLTEXT';
    result.mime     = 'PDF';

    result.hal_identifiant = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/view\/index(\/|\?)(docid|identifiant)(\/|=)(([a-z]+-)?0*([0-9]+))_?(v[0-9]+)?\/([a-zA-Z]*)\/?$/i.exec(path)) !== null) {
      /** Accès à une notice dans un format d'export
       /view/index/docid/1302902/tei
       /view/index?docid=1302902/tei
       /view/index/identifiant/hal-01302902/tei
       /view/index?identifiant=hal-01302902/tei
       */
      result.hal_collection = match[1];

      result.rtype    = 'EXPORT';
      result.mime     = match[9].toUpperCase();

      if (match[3].toUpperCase() == 'DOCID') {
          result.hal_docid = match[5];
      } else {
          result.hal_identifiant = match[5];
      }
  }

  return result;
});

