#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doiPrefix = '10.1159';

/**
 * Recognizes the accesses to the platform Karger
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/article\/([a-z]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // /Article/FullText/373881
    // /Article/Pdf/373881
    // /Article/Abstract/373881

    result.unitid = match[2];

    let doiSuffix = match[2];

    if (doiSuffix.length < 9) {
      doiSuffix = `${'0'.repeat(9 - doiSuffix.length)}${doiSuffix}`;
    }
    result.doi = `${doiPrefix}/${doiSuffix}`;

    switch (match[1].toLowerCase()) {
    case 'fulltext':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    }
  }

  return result;
});
