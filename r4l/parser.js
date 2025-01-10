#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Research4Life
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

  if ((/^\//i.test(path) && parsedUrl.hash != null) || /^\/search\/?/i.test(path)) {
    // https://hinari.summon.serialssolutions.com/#!/search?pn=1&ho=t&include.ft.matches=f&l=en&q=food
    // https://hinari.summon.serialssolutions.com/#!/search?pn=1&ho=t&include.ft.matches=f&l=en&q=applied%20economics
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(tacsgr1pubs_acs_org|tacsgr1cdnsciencepub_com)\/doi\/pdf\/([0-9.]+)\/([.A-Za-z0-9-]+)$/i.exec(path)) !== null) {
    // https://login.research4life.org/tacsgr1pubs_acs_org/doi/pdf/10.1021/acs.jafc.8b05215
    // https://login.research4life.org/tacsgr1cdnsciencepub_com/doi/pdf/10.1139/apnm-2021-0400
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = `${match[2]}/${match[3]}`;
    result.unitid   = `${match[2]}/${match[3]}`;

  } else if ((match = /^\/(tacsgr1pubs_acs_org|tacsgr1cdnsciencepub_com)\/(doi|doi\/full)\/([0-9.]+)\/([.A-Za-z0-9-]+)$/i.exec(path)) !== null) {
    // https://login.research4life.org/tacsgr1pubs_acs_org/doi/10.1021/acs.jafc.8b05215
    // https://login.research4life.org/tacsgr1cdnsciencepub_com/doi/full/10.1139/apnm-2021-0400
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.doi      = `${match[3]}/${match[4]}`;
    result.unitid   = `${match[3]}/${match[4]}`;

  } else if ((match = /^\/tacsgr1onlinelibrary_wiley_com\/doi\/pdf\/([0-9.]+)\/([A-Za-z0-9.-]+)$/i.exec(path)) !== null) {
    // https://login.research4life.org/tacsgr1onlinelibrary_wiley_com/doi/pdf/10.1002/9781118663233.ch17
    // https://login.research4life.org/tacsgr1onlinelibrary_wiley_com/doi/pdf/10.1002/9780470768150.ch12
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.doi      = `${match[1]}/${match[2]}`;
    result.unitid   = `${match[1]}/${match[2]}`;

  } else if ((match = /^\/tacsgr1www_spiedigitallibrary_org\/[A-Za-z0-9-]+\/([0-9]+)\/[0-9]+\/[A-Za-z0-9-]+\/([0-9.]+)\/([0-9.]+)(.full)?$/i.exec(path)) !== null) {
    // https://login.research4life.org/tacsgr1www_spiedigitallibrary_org/conference-proceedings-of-spie/12941/3011848/Research-on-fresh-food-delivery-path-optimization-based-on-genetic/10.1117/12.3011848.full
    // https://login.research4life.org/tacsgr1www_spiedigitallibrary_org/conference-proceedings-of-spie/11915/2605916/Research-on-classification-method-of-food-packaging-character-defects/10.1117/12.2605916.full
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.vol      = match[1];
    result.doi      = `${match[2]}/${match[3]}`;
    result.unitid   = `${match[2]}/${match[3]}`;
  }

  return result;
});
