#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kheox
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/[a-z]+\/document\/[a-z]+\/([a-z0-9:_.-]+)\/(1|2)$/i.exec(path)) !== null) {
    // /bt/document/FM/BONI04SI30F333_2004-09-01T00:00:00/1
    result.rtype  = 'RECORD';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/pdf\/([a-z0-9:_.-]+)$/i.exec(path)) !== null) {
    // /pdf/wt_fd28f8cffdb669c5550f0f2dc7668615
    result.rtype  = 'RECORD';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if (/^\/[a-z]+\/recherche\/resultats$/i.test(path)) {
    // /bt/recherche/resultats
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
