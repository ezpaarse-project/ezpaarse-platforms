#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Theses.fr
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

  if ((match = /^\/api\/v1\/document\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // /api/v1/document/2019LYSE2053
    result.rtype = 'PHD_THESIS';
    result.unitid = match[1];
    switch (ec.status) {
    case 200:
      result.mime = 'PDF';
      break;
    case 302:
      result.mime = 'HTML';
      break;

    default:
      result.mime = 'MISC';
      break;
    }

  } else if ((match = /^\/([0-9]{8}[0-9X])$/i.exec(path)) !== null) {
    // /258987731
    result.rtype = 'BIO';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.ppn = match[1];

  } else if ((match = /^\/(s[0-9]+)$/i.exec(path)) !== null) {
    // /s366354
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/(([0-9]{4})([a-z]{4})[0-9a-z]+)$/i.exec(path)) !== null) {
    // /2023UPASP097
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];
  }

  return result;
});
