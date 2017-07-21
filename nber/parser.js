#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NBER
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/([a-z]+)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // http://www.nber.org/papers/w20518
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[2];

    if (match[1] === 'papers') {
      result.rtype = 'ABS';
    }
  } else if (/^\/[a-z]+.html$/i.test(path)) {
    // /papers.html
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if ((match = /^\/([a-z]+)\/([a-z0-9]+).pdf$/i.exec(path)) !== null) {
    // papers/w20518.pdf
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.unitid = match[2];
    if (match[1] == 'papers') {
      result.doi   = '10.3386/' + match[2];
      result.rtype = 'WORKING_PAPER';
    }
  } else if ((match = /^\/[a-z]+\/[a-z]+\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /papers/mail/w21683
    result.rtype  = 'WORKING_PAPER';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/([a-z]+)\/?$/i.test(path)) {
    // /booksbyyear/
    result.rtype = 'TOC';
    result.mime  = 'MISC';

  } else if ((match = /^\/([a-z]+)\/([a-z0-9-]*)(.html)?$/i.exec(path)) !== null) {
    // /booksbyyear/1920s.html
    // /books/mitc21-1
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[2];
  }

  return result;
});

