#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform National Consumer Law Center
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

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://library.nclc.org/search?0=ip_login_no_cache%3Dc2a2c9a99b2b83734b653c888af52654
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/sites\/default\/files\/([0-9a-z_-]+)\.pdf$/i.exec(path)) !== null) {
    // https://library.nclc.org/sites/default/files/Bankr12_Appx_C-2-3.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/sites\/default\/files\/([0-9a-z_-]+)\.doc$/i.exec(path)) !== null) {
    // https://library.nclc.org/sites/default/files/BankrAppxG-Form-23.doc
    result.rtype    = 'OTHER';
    result.mime     = 'TEXT';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
