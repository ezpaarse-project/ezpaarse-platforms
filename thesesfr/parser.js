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

  if ((match = /^\/api\/v1\/document\/(([0-9]{4})([0-9a-z]{4})[0-9a-z]+)$/i.exec(path)) !== null) {
    // /api/v1/document/2019LYSE2053
    // /api/v1/document/2010AIX22039
    result.rtype = 'PHD_THESIS';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];
    switch (Number.parseInt(ec.status, 10)) {
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

  } else if (
    (match = /^\/([0-9]{8}[0-9X])$/i.exec(path)) !== null
    || (match = /^\/api\/v1\/personnes\/personne\/([0-9]{8}[0-9X])$/i.exec(path)) !== null
  ) {
    // /264066944
    // /api/v1/personnes/personne/264066944
    result.rtype = 'BIO';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.ppn = match[1];

  } else if (
    (match = /^\/(s[0-9]+)$/i.exec(path)) !== null
    || (match = /^\/api\/v1\/theses\/these\/(s[0-9]+)$/i.exec(path)) !== null
  ) {
    // /s366354
    // /api/v1/theses/these/s383095
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if (
    (match = /^\/(([0-9]{4})([0-9a-z]{4})[0-9a-z]+)$/i.exec(path)) !== null
    || (match = /^\/api\/v1\/theses\/these\/(([0-9]{4})([0-9a-z]{4})[0-9a-z]+)$/i.exec(path)) !== null
  ) {
    // /2023UPASP097
    // /api/v1/theses/these/2024BORD0122
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.publication_date = match[2];
    result.institution_code = match[3];

  } else if (/^\/api\/v1\/theses\/recherche\/$/i.test(path)) {
    // /api/v1/theses/recherche/?q=test&debut=0&nombre=10&tri=pertinence
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  }

  return result;
});
