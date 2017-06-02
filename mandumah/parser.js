#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DarAlMandumah
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param  = parsedUrl.query || {};

  let match;
  if (/^\/Download$/.test(path)) {
    // https://search.mandumah.com/Download?file=myKKhfKhydDL0/C3P70vRDa4AcZ3yTcQaiPlBVyE9ew=&id=688618
    // http://search.mandumah.com/Download?file=uv37ILCGhcj2gV4PvVhTK5CE+24syhv3CeGpjz1DqWs=&id=646753&show=1
    result.rtype  = 'ARTICLE';
    result.mime   = param.show ? 'HTML': 'PDF';
    result.unitid = param.id;

  } else if ((match = /^\/Record\/([0-9]+)$/.exec(path)) !== null) {
    // https://search.mandumah.com/Record/126627
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});

