#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Patrologia Latina Database
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/all\/fulltext$/i.test(path)) {
    // /all/fulltext?ALL=Y&ACTION=byid&warn=N&div=4&id=Z400103407&FILE=../session/1602771489_15773&CURDB=pld
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.db_id  = param.CURDB || 'pld';
    result.unitid = param.id;
  }

  return result;
});
