#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform biocyc
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/[A-Z0-9_]+\/NEW-IMAGE$/i.test(path)) {
    // /ECOLI/NEW-IMAGE?type=PATHWAY&object=PWY-8147
    // /GCF_000733215/NEW-IMAGE?type=LOCUS-POSITION&object=NIL&orgids=GCF_000733215&chromosome=NW_011934226&bp-range=1/50000
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = `${param.object || ''}/${param.orgids || ''}/${param.chromosome || ''}`;
  } else if (/^\/[A-Z0-9_]+\/substring-search$/i.test(path)) {
    // /GCF_000733215/substring-search?type=NIL&object=gene
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
