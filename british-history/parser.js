#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform British History Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  let match;

  if (/^\/$/i.test(path)) {
    // http://www.british-history.ac.uk:80/
    result.rtype    = 'CONNECTION';
    result.mime     = 'MISC';

  } else if (/^\/search/i.test(path)) {
    // https://www.british-history.ac.uk:443/search?query=cromwell
    // https://www.british-history.ac.uk:443/search/place/london/subject/administrative-and-legal/result-type/book-section?query=cromwell
    // https://www.british-history.ac.uk:443/search/series/rushworth-papers
    result.rtype      = 'SEARCH';
    result.mime       = 'MISC';

  } else if (((match = /^\/(catalogue|using-bho|no-series|petitions)$/i.exec(path)) !== null) || ((match = /^\/(catalogue|using-bho|no-series|petitions)\/([a-zA-Z0-9/-]+)/i.exec(path)) !== null)) {
    result.rtype      = 'TOC';
    result.mime       = 'HTML';
    if ((match[2] == null) || (match[2] == undefined)) {
      // https://www.british-history.ac.uk:443/catalogue
      // https://www.british-history.ac.uk:443/using-bho
      result.title_id = match[1];
      result.unitid   = match[1];
    } else if ((match[2] !== null) || (match[2] !== undefined)) {
      // https://www.british-history.ac.uk:443/catalogue/south-east
      // https://www.british-history.ac.uk:443/using-bho/biography-guide
      // https://www.british-history.ac.uk:443/no-series/vestry-mins-colechurch-1613-72
      result.title_id = match[1];
      result.unitid   = match[1] + '/' + match[2];
    }

  } else if (((match = /^\/([a-zA-Z0-9-/]+)\/vol([0-9]+)$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9-/]+)\/vol([0-9]+)\/pp([0-9-]+)$/i.exec(path)) !== null)) {
    if ((match[3] == null) || (match[3] == undefined)) {
      // https://www.british-history.ac.uk:443/cal-state-papers/venice/vol3
      // https://www.british-history.ac.uk:443/rushworth-papers/vol2
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = match[1];
      result.unitid   = match[1] + '/vol' + match[2];
    } else if ((match[3] !== null) || (match[3] !== undefined)) {
      // https://www.british-history.ac.uk:443/cal-state-papers/venice/vol3/pp152-159
      // https://www.british-history.ac.uk:443/rushworth-papers/vol2/pp319-378
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'HTML';
      result.title_id = match[1];
      result.unitid   = match[1] + '/vol' + match[2] + '/pp' + match[3];
    }

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z-]+)$/i.exec(path)) !== null) {
    // https://www.british-history.ac.uk:443/os-1-to-10560/buckinghamshire
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z-]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.british-history.ac.uk:443/os-1-to-10560/buckinghamshire/001
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  }

  return result;
});
