#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sage Knowledge
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  // /books/10-winning-strategies-for-leaders-in-the-classroom
  // /reference/21stcenturyanthro
  if ((match = /^\/(books|reference)\/([a-z0-9-]+)\/*$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.title_id = match[2];
  }

  // /books/10-winning-strategies-for-leaders-in-the-classroom/n1.xml
  // /books/download/10-winning-strategies-for-leaders-in-the-classroom/n10.pdf
  // /reference/21stcenturyanthro/n29.xml
  // /reference/download/a-handbook-for-social-science-field-research/n8.pdf
  else if ((match = /^\/(?:books|reference)\/(?:download\/)?(([a-z0-9-]+)\/[a-z0-9]+)\.(pdf|xml)$/i.exec(path)) !== null) {
    result.rtype    = 'BOOK_SECTION';
    result.mime     = (match[3].toUpperCase() === 'PDF') ? 'PDF' : 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
  }

  return result;
});
