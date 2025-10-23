#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Brief.me
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

  if ((match = /^\/recherche\/?$/i.exec(path)) !== null) {
    // https://app.brief.me/recherche/?briefme_search_prod%5Bquery%5D=budget
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/edition\/(([0-9]{4}-[0-9]{2}-[0-9]{2})-[0-9]+-[a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // https://app.brief.me/edition/2025-10-01-4148-les-etats-unis-entrent-en-shutdown-les-sanctions-visant-le-nucleaire-iranien/
    result.rtype            = 'ISSUE';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.publication_date = match[2];

  } else if ((match = /^\/article\/(([0-9]{4}-[0-9]{2}-[0-9]{2})-[0-9]+-[a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // https://app.brief.me/article/2024-12-05-18028-les-budgets-de-letat-et-de-la-securite-sociale-en-suspens/
    result.rtype            = 'ARTICLE';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.publication_date = match[2];

  }

  return result;
});
