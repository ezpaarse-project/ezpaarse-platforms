#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Edimark
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/revues\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /revues/revue-de-la-pratique-avancee
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/revues\/(([a-z0-9-]+)\/(?:vol-([IVXLCDM]+)-)?n-([0-9-]+)(?:-copy)?)$/i.exec(path)) !== null) {
    // /revues/revue-de-la-pratique-avancee/vol-vi-n-1-copy
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3] && match[3].toUpperCase();
    result.issue    = match[4];

  } else   if ((match = /^\/revues\/([a-z0-9-]+)\/(?:vol-([IVXLCDM]+)-)?n-([0-9-]+)(?:-copy)?\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /revues/revue-de-la-pratique-avancee/vol-vi-n-1-copy/la-pair-aidance-une-pratique-innovante-dupartenariat-en-sante
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[4];
    result.title_id = match[1];
    result.vol      = match[2] && match[2].toUpperCase();
    result.issue    = match[3];

  }

  return result;
});
