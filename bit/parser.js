#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform B.I.T. Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;

  let match;

  if ((match = /^\/pdf\/[a-z]+\/([a-z0-9_-]+)$/i.exec(path)) !== null) {
    // https://www.b-i-t-online.de/pdf/bit/bit2021-1
    result.rtype  = 'ISSUE';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/heft\/([a-z0-9_-]+)(-index\.php|\.pdf)$/i.exec(path)) !== null) {
    // https://www.b-i-t-online.de/heft/2021-01-index.php
    // https://www.b-i-t-online.de/heft/2021-03-schwerpunkt-holtkamp.pdf

    result.rtype  = match[2] === '.pdf' ? 'ARTICLE' : 'TOC';
    result.mime   = match[2] === '.pdf' ? 'PDF' : 'HTML';
    result.unitid = match[1];
  }

  return result;
});
