#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Egora
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

  if ((match = /^\/search\/node\/(?!\/).+$/i.exec(path)) !== null) {
    // /search/node/nourrisson
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/[a-z-]+\/[a-z-]+\/([0-9]+)[a-z-]+$/i.exec(path)) !== null) {
    // /actus-pro/e-sante/72867-doctolib-devoile-la-duree-moyenne-d-une-teleconsultation-de-medecine
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
