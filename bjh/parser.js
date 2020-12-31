#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Boomjuridischtijdschriften
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

  if ((match = /^\/tijdschrift\/ELR\/[0-9]+\/[0-9]+\/([0-9a-z-]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.bjutijdschriften.nl/tijdschrift/ELR/2020/3/ELR-D-20-00016.pdf
    // https://www.bjutijdschriften.nl/tijdschrift/ELR/2020/3/ELR-D-20-00013.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/tijdschrift\/ELR\/[0-9]+\/[0-9]+\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://www.bjutijdschriften.nl/tijdschrift/ELR/2020/3/ELR-D-20-00013
    // https://www.bjutijdschriften.nl/tijdschrift/ELR/2020/3/ELR-D-20-00016
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/zoek$/i.exec(path)) !== null) {
    // https://www.bjutijdschriften.nl/zoek?utf8=%E2%9C%93&search_text=Law&search_kind=&search_journal_code=&spotlight=Search
    // https://www.bjutijdschriften.nl/zoek?utf8=%E2%9C%93&search_text=corporate&search_kind=&index=Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
