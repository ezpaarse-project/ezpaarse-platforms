#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Digitalia Film
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

  if ((match = /^\/visor\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.digitaliafilmlibrary.com/visor/1620
    // https://www.digitaliafilmlibrary.com/visor/882
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/film\/[0-9]+\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://www.digitaliafilmlibrary.com/film/1620/african-presidents--angola
    // https://www.digitaliafilmlibrary.com/film/322/03-34-terremoto-en-chile
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/sa$/i.test(path)) {
    // https://www.digitaliafilmlibrary.com/sa
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }


  return result;
});
