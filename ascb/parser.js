#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The American Society for Cell Biology
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/doi\/(?:(e?pdf|epub|abs|full|ref)\/)?(10\.[0-9]+\/([a-z0-9._-]+))$/i.exec(path)) !== null) {
    // /doi/10.1091/mbc.e09-12-1011
    // /doi/pdf/10.1091/mbc.E09-12-1011
    result.doi    = match[2];
    result.unitid = match[3];

    switch (match[1]) {
    case 'epdf':
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'epub':
      result.rtype = 'ARTICLE';
      result.mime  = 'EPUB';
      break;
    case 'ref':
      result.rtype = 'RECORD_VIEW';
      result.mime  = 'HTML';
      break;
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
    default:
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    }
  }

  return result;
});
