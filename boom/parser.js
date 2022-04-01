#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Boomportaal
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

  if ((match = /^\/tijdschrift\/([a-z]+)\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // https://www.boomportaal.nl/tijdschrift/PA/PA_2011_017_003_005?q=economie
    // https://www.boomportaal.nl/tijdschrift/TCC/TCC_2211-9507_2021_011_002_003
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];

    const printId = match[2].split('_')[1];

    if (printId.includes('-')) {
      result.print_identifier = printId;
    }
  } else if ((match = /^\/databankartikel\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.boomportaal.nl/databankartikel/14396?q=economie
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/boek\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.boomportaal.nl/boek/9789462366589?q=economie#1
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.print_identifier = match[1];

  } else if ((match = /^\/catalogus$/i.exec(path)) !== null) {
    // https://www.boomportaal.nl/catalogus?t=ebook&q=economie
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
