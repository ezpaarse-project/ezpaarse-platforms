#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Association for the Advancement of Science
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/doi(\/(full|pdf|epdf|epub|abs))?\/(10.[0-9]+\/([a-z0-9-.]+))$/i.exec(path)) !== null) {
    result.unitid = match[4];
    result.doi = match[3];

    const type = match[2] || '';

    switch (type.toLowerCase()) {
    case 'pdf':
    case 'epdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    case 'epub':
      result.rtype = 'ARTICLE';
      result.mime = 'EPUB';
      break;
    case 'abs':
      result.rtype = 'ABS';
      result.mime = 'HTML';
      break;
    default:
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    }

  } else if ((match = /^\/toc\/([a-z]+)\/current$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else if ((match = /^\/toc\/(([a-z]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];
  }

  return result;
});
