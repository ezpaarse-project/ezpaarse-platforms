#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const doiPrefix = '10.1155';

/**
 * Recognizes the accesses to the platform Hindawi
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

  if ((match = /^\/journals\/([a-z]+)\/(([0-9]{4})\/([0-9]+))\/$/i.exec(path)) !== null) {
    // https://www.hindawi.com/journals/apec/2021/5582774/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.publication_date = match[3];
    result.unitid = match[2];
    result.doi = `${doiPrefix}/${match[2]}`;
  } else if ((match = /^\/journals\/([a-z]+)\/(([0-9]{4})\/([0-9]+))\.ris$/i.exec(path)) !== null) {
    // https://www.hindawi.com/journals/apec/2021/5582774.ris
    result.rtype = 'RECORD_VIEW';
    result.mime = 'RIS';
    result.title_id = match[1];
    result.publication_date = match[3];
    result.unitid = match[2];
    result.doi = `${doiPrefix}/${match[2]}`;
  } else if ((match = /^\/search\/all\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.hindawi.com/search/all/Circuit
    // https://www.hindawi.com/search/all/Circuit?journal=Abstract+and+Applied+Analysis&journal=Adsorption+Science+%26+Technology
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    // search field
    result.search_term = match[1];
  }

  return result;
});
