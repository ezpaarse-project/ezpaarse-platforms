#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Legal Bluebok Online
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

  if ((match = /^\/bluebook\/[a-z0-9]+\/(bluepages|rules|tables|bluetables)\/([a-z0-9-/]+)$/i.exec(path)) !== null) {
    // /bluebook/v21/bluepages/b1-structure-of-legal-citations
    // /bluebook/v21/rules/1-structure-and-use-of-citations/1-1-citation-sentences-and-clauses-in-law-reviews
    // /bluebook/v21/tables/t1-united-states-jurisdictions/t1-2-federal-administrative-and-executive-materials/armed-services-board-of-contract-appeals-asbca
    // /bluebook/v21/bluetables/bt1-court-documents
    result.mime = 'HTML';
    result.unitid = `${match[1]}/${match[2]}`;
  }

  return result;
});
