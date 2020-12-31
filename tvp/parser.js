#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tijdschrift Voor Psychiatrie
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

  if ((match = /^\/assets\/articles\/([0-9a-z-]+)\.pdf$/i.exec(path)) !== null) {
    // http://www.tijdschriftvoorpsychiatrie.nl/assets/articles/62-2020-10-artikel-nieuws.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/.+\/issues\/[0-9]+\/articles\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.tijdschriftvoorpsychiatrie.nl/en/issues/557/articles/12342
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[0];
  } else if ((match = /^\/.+\/issues\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.tijdschriftvoorpsychiatrie.nl/en/issues/557
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/.+\/zoeken\/term$/i.exec(path)) !== null) {
    // http://www.tijdschriftvoorpsychiatrie.nl/en/zoeken/term?utf8=%E2%9C%93&words=Psychose&sort=time&commit=search
    // http://www.tijdschriftvoorpsychiatrie.nl/en/zoeken/term
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
