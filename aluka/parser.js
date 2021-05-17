#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform JSTOR ALUKA
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

  if ((match = /^\/heritage\/search$/i.exec(path)) !== null) {
    // https://www.aluka.org/heritage/search?so=ps_collection_name_str+asc&Query=artist
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  } else if ((match = /^\/struggles\/collection\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.aluka.org/struggles/collection/AAM?searchUri=so%3Dps_collection_name_str%2Basc%26Query%3Dart
    result.rtype = 'TOC';
    result.mime  = 'HTML';
  } else if ((match = /^\/stable\/pdf\/(10\.\d+\/(.+))$/i.exec(path)) !== null) {
    // https://www.aluka.org/stable/pdf/10.5555/al.sff.document.poco0240a2
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.doi    = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/stable\/(10\.\d+\/(.+))$/i.exec(path)) !== null) {
    // https://www.aluka.org/stable/10.5555/al.ch.document.bfacp1b80015?searchUri=so%3Dps_collection_name_str%2Basc%26Query%3Dartist
    result.rtype  = 'RECORD_VIEW';
    result.mime   = 'HTML';
    result.doi    = match[1];
    result.unitid = match[2];
  }

  return result;
});
