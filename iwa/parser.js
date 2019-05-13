#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IWA (International Water Association) Publishing
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/([a-z]+)\/(article|issue)\/([0-9]+)\/([0-9]+)(\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9_-]+))?$/i.exec(path)) !== null) {
    // /hr/article/50/2/417/65541/Long-term-hydrological-changes-after-various-river
    // /hr/issue/50/2
    if (match[2] === 'issue') {
      result.title_id = match[1];
      result.vol = match[3];
      result.issue = match[4];
      result.unitid = `${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
      result.rtype = 'TOC';
      result.mime = 'HTML';
    }

    if (match[2] === 'article') {
      result.title_id = match[1];
      result.vol = match[3];
      result.issue = match[4];
      result.first_page = match[6];
      result.unitid = match[8];
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    }
  }

  return result;
});
