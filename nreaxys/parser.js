#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Matching between the parameters found in openurl queries and EC fields
 */
const openUrlFields = {
  'issn': 'print_identifier',
  'isbn': 'print_identifier',
  'volume': 'vol',
  'issue': 'num',
  'spage': 'first_page',
  'title': 'publication_title',
  'id': 'unitid',
  'coden': 'coden'
};

/**
 * Recognizes the accesses to the platform New Reaxys
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  if (/^\/services\/print\/download$/i.test(path)) {
    // /services/print/download?access_token=25264948-3c9d-4b4a-9851-fca63251f78a&jobId=21641899_20180115_085956_796&document=21641899_20180115_085956_796.pdf

    result.rtype = 'RECORD_VIEW';
    result.mime  = 'PDF';

    if (param.document) {
      result.unitid = param.document.replace(/\.[a-z]{2,4}$/i, '');
    }

  } else if (/^\/xflink$/i.test(path)) {
    // /xflink?aulast=Iglesias&title=Medicina%20Veterinaria&volume=15&issue=12&spage=655&date=1998&coden=MDVEB&doi=&issn=0212-8292
    result.rtype    = 'OPENURL';
    result.mime     = 'MISC';

    for (const key in param) {
      const matchingValue = openUrlFields[key];

      if (matchingValue) {
        result[matchingValue] = param[key];
      }
    }

    if (param.pages) {
      const pagesMatch = /^(\d+)-(\d+)$/.exec(param.pages);

      if (pagesMatch) {
        result.first_page = pagesMatch[1];
        result.last_page  = pagesMatch[2];
      }
    }

    if (result.unitid && result.unitid.toLowerCase().startsWith('doi:')) {
      result.doi = result.unitid = result.unitid.substr(4);
    }
  }

  return result;
});
