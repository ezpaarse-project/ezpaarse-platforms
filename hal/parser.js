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

  if ((match = /^\/file\/index\/(docid|identifiant)\/(([a-z]+-)?0*([0-9]+)(v[0-9]+)?)\/filename\/[^/]+.pdf$/i.exec(path)) !== null) {
    //Accès à un document
    // /file/index/docid/544258/filename/jafari_Neurocomp07.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.idtype   = match[1].toUpperCase();
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/([a-z]+-0*([0-9]+)(?:v[0-9]+)?)\/?(document|image|video|player)?\/?$/i.exec(path)) !== null) {
    //Accès à un document ou à une notice sans collection (avec et sans versions)
    // /hal-01085760/document
    // /hal-01085760/image
    // /hal-01085760/video
    // /hal-01085760/player
    // /hal-00137415/
    // Avec une collection pour toutes les URLS ci-dessus : /COL/hal-00137415/

    // COLLECTION
    result.collection = match[1];

    result.rtype    = match[4] ? 'ARTICLE' : 'ABS';
    result.mime     = match[4] ? 'PDF' : 'HTML';
    result.idtype   = 'IDENTIFIANT';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/view\/index(\/|\?)(docid|identifiant)(\/|=)(([a-z]+-)?0*([0-9]+)(v[0-9]+)?)\/?$/i.exec(path)) !== null) {
    // Accès à une notice HTML (avec et sans versions) (avec et sans collections)
    // /view/index/docid/1302902
    // /view/index?docid=1302902
    // /view/index/identifiant/hal-01302902
    // /view/index/identifiant/hal-01302902v2
    // /view/index?identifiant=hal-01302902
    // /view/index?identifiant=hal-01302902v2
    // Avec une collection pour toutes les URLS ci-dessus : /COL/hal-00137415/

    // COLLECTION
    result.collection = match[1];

    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.idtype   = match[3].toUpperCase();
    result.title_id = match[5];
    result.unitid = match[5];

  } else if ((match = /^\/?([A-Z-0-9]+)?\/file\/index(\/|\?)(docid|identifiant)(\/|=)(([a-z]+-)?0*([0-9]+)(v[0-9]+)?)((\/|\&)fileid(\/|=)1)?(\/|\&)main(\/|=)(1|true)\/?$/i.exec(path)) !== null) {
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
    result.collection = match[1];

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.idtype   = match[3].toUpperCase();
    result.title_id = match[5];
    result.unitid = match[5];
    
  } else if ((match = /^\/?([A-Z0-9\-]+)?\/([a-z]+-[0-9]+v?[0-9]+?)\/file\/[^/]+.pdf$/i.exec(path)) !== null) {
    //Accès à un document (avec et sans versions) (avec et sans collections)
    // /hal-00137415/file/jafari_Neurocomp07.pdf

    // COLLECTION
    result.collection = match[1];

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.idtype   = 'IDENTIFIANT';
    result.title_id = match[2];
    result.unitid   = match[2];
  }
    
    /** Accès à une notice dans un format d'export : qu'est-ce qu'on en fait ?
         /hal-00137415/tei
         /view/index/docid/1302902/tei
         /view/index?docid=1302902/tei
         /view/index/identifiant/hal-01302902/tei
         /view/index?identifiant=hal-01302902/tei
    */

  return result;
});

