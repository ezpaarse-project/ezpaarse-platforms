#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform L'Argus de l 'Assurance
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;

  let match;

  if (/^\/rechercher\/?$/i.test(path)) {
    // https://www.argusdelassurance.com/rechercher/?query=bee
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/archives\/([a-z-]+\/([0-9]{4}))\/?$/i.exec(path)) !== null) {
    // https://www.argusdelassurance.com/archives/argus-de-l-assurance/2026
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.publication_date = match[2];

  } else if ((match = /^\/[a-z-]+\/[a-z-]+\/[a-z0-9-]+\.([0-9]+)$/i.exec(path)) !== null) {
    // https://www.argusdelassurance.com/epargne/assurance-vie/rendements-assurance-vie-la-mondiale-stabilise-ses-rendements-en-2025-avec-un-plancher-en-dessous-de-la-moyenne.238066
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
