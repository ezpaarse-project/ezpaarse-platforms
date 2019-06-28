#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Unbound Medicine
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

  if ((match = /^\/[0-9a-z]+\/qas$/i.exec(path)) !== null) {
    // https://www.unboundmedicine.com:443/5minute/qas?term=stomach
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/[0-9a-z]+\/search$/i.exec(path)) !== null) {
    // https://www.unboundmedicine.com:443/5minute/search?st=OSS&q=stomach
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/[a-z0-9]+\/view\/(.*)$/i.exec(path)) !== null) {
    // https://www.unboundmedicine.com:443/5minute/view/5-Minute-Clinical-Consult/816407/all/Gastric_Cancer
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/news\/(.*)$/i.exec(path)) !== null) {
    // https://www.unboundmedicine.com:443/news/apsa_pediatric_surgery_library
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/solutions\/(.*)$/i.exec(path)) !== null) {
    // https://www.unboundmedicine.com:443/solutions/nursing_schools
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
