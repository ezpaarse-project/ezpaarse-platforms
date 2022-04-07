#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Archidat Bouwformatie
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

  if (/^\/zoeken\/(.+)$/i.test(path)) {
    // https://www.bouwformatie.nl/zoeken/Houtskeletbouw
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-z]+)\/([a-z0-9-%]+)(\/?)$/i.exec(path)) !== null) {
    // https://www.bouwformatie.nl/bouwnieuws/verwijdering-lekbrug-duurder-door-kapotte-kabel
    // https://bouwtechniek.bouwformatie.nl/projecten/Rijtjeswoning%20-%20Houtskeletbouw/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.db_id   = match[1];
    result.title_id   = match[2];
    result.unitid   = match[2];
  }

  return result;
});
