#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Acta Sanctorum
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};


  if (/\/all\/fulltext$/i.test(path)) {
    // /all/fulltext?ACTION=byoffset&WARN=N&OFFSET=6&DIV=0&FILE=../session/1512118406_16047
    // /all/fulltext?ACTION=byid&warn=N&ID=Z400066700&div=4&FILE=../session/1512122298_18844&DBOFFSET=3156395&ENTRIES=11
    result.rtype  = (param.id || param.ID) ? 'BOOK_SECTION' : 'BOOK';
    result.mime   = 'HTML';
    result.unitid = (param.id || param.ID);

  } else if (/\/all\/figure$/i.test(path)) {
    // /all/figure?id=FA01001&file=../session/1512118406_16047
    result.rtype  = 'FIGURE';
    result.mime   = 'GIF';
    result.unitid = (param.id || param.ID);
  }

  return result;
});
