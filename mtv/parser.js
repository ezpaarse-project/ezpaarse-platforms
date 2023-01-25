#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Medici TV
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

  if ((match = /^\/[a-z]{2}\/([a-z-]+)\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://edu.medici.tv/en/concerts/charles-dutoit-kodaly-prokofiev-stravinsky-alexander-malofeev
    // https://edu.medici.tv/en/masterclasses/master-class-daniel-hope-chamber-music-society
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.db_id = match[1];
    result.title_id = match[2];
    result.unitid = match[2];

  } else if (/^\/[a-z]{2}\/search\/$/i.test(path)) {
    // https://edu.medici.tv/en/search/?q=piano
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
