#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Cochrane Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/podcasts\/10\.[0-9]+\/([a-z0-9._-]+)$/i.exec(path)) !== null) {
    // /podcasts/10.1002/14651858.CD010537.pub4
    result.rtype  = 'AUDIO';
    result.mime   = 'EPUB';
    result.unitid = match[1];

  } else if ((match = /^\/([a-z0-9]+)\/doi\/(10\.[0-9]+\/(?:[a-z0-9]+\/)?([a-z0-9._-]+))\/(abstract|full)$/i.exec(path)) !== null) {
    // /cdsr/doi/10.1002/14651858.CD013600/abstract
    // /central/doi/10.1002/central/CN-01445589/full
    result.rtype    = match[4] === 'full' ? 'ARTICLE' : 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.doi      = match[2];
    result.unitid   = match[3];

  } else if ((match = /^\/([a-z0-9]+)\/doi\/(10\.[0-9]+\/([a-z0-9._-]+))\/pdf\/[a-z0-9]+\/[a-z0-9]+\/[a-z0-9._-]+\.pdf$/i.exec(path)) !== null) {
    // /cdsr/doi/10.1002/14651858.CD013600/pdf/CDSR/CD013600/CD013600_standard.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.doi      = match[2];
    result.unitid   = match[3];
  } else if ((match = /^\/([a-z0-9]+)\/table-of-contents\/([0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // /cdsr/table-of-contents/2020/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = `${match[1]}/${match[2]}`;
  }

  return result;
});
