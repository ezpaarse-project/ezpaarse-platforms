#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform My Cow
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/([a-z-]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /article-a-lire-et-a-ecouter-en-anglais/sur-pourquoi-le-cerveau-reve
    result.rtype  = 'ARTICLE';
    result.mime   = 'MISC';
    result.unitid = match[2];

    if (/videos/i.test(match[1])) {
      result.rtype = 'VIDEO';
    }
  }

  return result;
});

