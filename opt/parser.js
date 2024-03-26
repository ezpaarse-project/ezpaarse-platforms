#!/usr/bin/env node

'use strict';
//const { initParams } = require('request');
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Oxford Politics Trove
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search$/i.test(path) && param.q !== null) {
    // https://www.oxfordpoliticstrove.com/search?q=terrorism&searchBtn=Search&isQuickSearch=true
    // https://www.oxfordpoliticstrove.com/search?q=economy&searchBtn=Search&isQuickSearch=true
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/display\/([0-9.]+)\/([a-zA-Z0-9]+)\/([0-9.]+)\/([a-zA-Z0-9]+)-([0-9]+)$/i.exec(path)) !== null) {
    // https://www.oxfordpoliticstrove.com/display/10.1093/hepl/9780198853220.001.0001/hepl-9780198853220?rskey=jumv8t&result=2
    // https://www.oxfordpoliticstrove.com/display/10.1093/hepl/9780198829560.001.0001/hepl-9780198829560?rskey=va4v17&result=2
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi      = `${match[1]}/${match[2]}/${match[3]}`;
    result.print_identifier   = match[5];
    result.unitid             = `${match[1]}/${match[2]}/${match[3]}/${match[4]}-${match[5]}`;
  } else if ((match = /^\/display\/([0-9.]+)\/([a-zA-Z0-9]+)\/([0-9.]+)\/([a-zA-Z0-9]+)-([0-9]+)-chapter-([0-9]+)$/i.exec(path)) !== null) {
    // https://www.oxfordpoliticstrove.com/display/10.1093/hepl/9780198829560.001.0001/hepl-9780198829560-chapter-1
    // https://www.oxfordpoliticstrove.com/display/10.1093/hepl/9780198820819.001.0001/hepl-9780198820819-chapter-2
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.doi      = `${match[1]}/${match[2]}/${match[3]}`;
    result.print_identifier   = match[5];
    result.unitid             = `${match[1]}/${match[2]}/${match[3]}/${match[4]}-${match[5]}-chapter-${match[6]}`;
  }

  return result;
});
