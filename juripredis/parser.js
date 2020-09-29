#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Juripredis
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let hash   = parsedUrl.hash;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^#\/app\/arret\/.*/i.exec(hash)) !== null) {
    // https://app.juripredis.com/#/app/arret/JURITEXT000039307272
    // https://app.juripredis.com/#/app/arret/CEDHTEXT001-99012
    // https://app.juripredis.com/#/app/arret/CETATEXT000007643577/eyJmcmVlX3RleHQiOiJjb2RlIiwianVya
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.title_id = 'JURITEXT';
    result.unitid   = 'JURICAFORTDEFRANCE202009190136349556';

  }

  return result;
});
