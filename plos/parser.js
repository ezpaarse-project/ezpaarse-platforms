#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform PLOS
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let match;

  if ((match = /^\/([a-z]+)\/article(\/file)?$/i.exec(path)) !== null) {
    // /plosntds/article?id=10.1371/journal.pntd.0008617
    // /plosntds/article/file?id=10.1371/journal.pntd.0008617&type=printable
    // /plosntds/article/file?id=10.1371/journal.pntd.0008617&type=manuscript
    result.rtype = 'ARTICLE';
    result.title_id = match[1];

    if (match[2] && param.type === 'printable') {
      result.mime = 'PDF';
    } else if (match[2] && param.type === 'manuscript') {
      result.mime = 'XML';
    } else if (!match[2]) {
      result.mime = 'HTML';
    }

    const idMatch = /^(10\.[0-9]+\/(.+))$/.exec(param.id);

    if (idMatch) {
      result.doi = idMatch[1];
      result.unitid = idMatch[2];
    }

  } else if ((match = /^\/([a-z]+)\/?$/i.exec(path)) !== null) {
    // /plosone/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
