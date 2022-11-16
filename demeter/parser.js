#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DEMETER
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/liste-des-depots-formulaire-sciences-([0-9]+)\/?$/i.exec(path)) !== null) {
    // /liste-des-depots-formulaire-sciences-2022
    // /liste-des-depots-formulaire-sciences-2022/

    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = `liste-des-depots-formulaire-sciences-${match[1]}`;

  } else if ((match = /^\/faculte\/faculte-humanite\/memoires-non-consultables$/i.exec(path)) !== null) {
    // /faculte/faculte-humanite/memoires-non-consultables
    result.rtype = 'TOC';
    result.mime = 'HTML';

  } else if ((match = /^\/ameluco$/i.exec(path)) !== null) {
    // /ameluco?f[search]=biologie&f[year]=2014
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/sites\/default\/files\/fichiersmemoires\/([a-z0-9-]+).pdf$/i.exec(path)) !== null) {
    // /sites/default/files/fichiersmemoires/xad-uco-2730.pdf
    result.rtype = 'MASTER_THESIS';
    result.mime = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/memoire\/([0-9]+)$/i.exec(path)) !== null) {
    // /memoire/4117
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = match[1];

  }



  return result;
});
