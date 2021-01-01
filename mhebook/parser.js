#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform McGraw Hill Education Book Library
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

  if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://mhebooklibrary.com/action/doSearch?AllField=healthcare&ConceptID=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/doi\/book\/.+\/([0-9]+)$/i.exec(path)) !== null && param.contentTab) {
    // https://mhebooklibrary.com/doi/book/10.1036/9781260459821?contentTab=true
    // https://mhebooklibrary.com/doi/book/10.1036/9781260462050?contentTab=true
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/book\/.+\/([0-9]+)$/i.exec(path)) !== null) {
    // https://mhebooklibrary.com/doi/book/10.1036/9781260459821
    // https://mhebooklibrary.com/doi/book/10.1036/9781260462050
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/pdf\/.+\/([0-9]+)$/i.exec(path)) !== null) {
    // https://mhebooklibrary.com/doi/pdf/10.1036/9781260462050
    // https://mhebooklibrary.com/doi/pdf/10.1036/9780071739962
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
