#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Doranum
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

  let match;

  if ((match = /^\/wp-content\/uploads\/[a-z0-9_-]+10_([0-9]+)_([a-z0-9-]+)\.zip$/i.exec(path)) !== null) {
    // /wp-content/uploads/doranum_01_fiche_synthetique_10_13143_mgcn-1863.zip
    result.rtype = 'RECORD';
    result.mime = 'ZIP';
    result.doi = `10.${match[1]}/${match[2]}`;

    result.unitid = match[2];

  } else if ((match = /^\/[a-z-]+\/[a-z0-9_-]+10_([0-9]+)_([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // /aspects-juridiques-ethiques/lois-pour-open-data_10_13143_k917-g053/
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';

    result.doi = `10.${match[1]}/${match[2]}`;
    result.unitid = match[2];

  } else if (path === '/' && param.s) {
    // /?s=formulaire
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
