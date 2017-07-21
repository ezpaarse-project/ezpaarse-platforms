#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme IOS press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/articles\/([a-z-]+)\/([a-z]+[0-9]+)$/.exec(path)) !== null) {
    // articles/journal-of-pediatric-infectious-diseases/
    // jpi00094?resultNumber=0&totalResults=1834&start=0&q=disease&resultsPageSize=10&rows=10
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/download\/([a-z-]+)\/([a-z]+[0-9]+)$/.exec(path)) !== null) {
    // download/journal-of-pediatric-infectious-diseases/jpi00094?id=journal-of-pediatric-infectious-diseases%2Fjpi00094
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/journals\/(([a-z-]+)(?:\/([0-9]+)\/([0-9]+))?)\/?$/.exec(path)) !== null) {
    // journals/biofactors/30/4
    // journals/biofactors
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.vol      = match[3];
    result.issue    = match[4];
    result.title_id = match[2];
    result.unitid   = match[1];
  }

  return result;
});
