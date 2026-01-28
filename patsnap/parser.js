#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Patsnap
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path = parsedUrl.pathname;
  const hostname = parsedUrl.hostname;

  let match;

  // Ignore static assets
  if (/^discovery-static\.patsnap\.com$/i.test(hostname)) {
    return result;
  }

  // Company profile page: /company/{company-slug}/
  if ((match = /^\/company\/([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    const companySlug = match[1];
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.title_id = companySlug;
    result.unitid = companySlug;
    return result;
  }

  // Company section pages: /company/{company-slug}/{section}/
  if ((match = /^\/company\/([a-z0-9-]+)\/(news|patent|funding|acquisition|investment|financial|expert|member)\/?$/i.exec(path)) !== null) {
    const companySlug = match[1];
    const section = match[2].toLowerCase();

    result.title_id = companySlug;
    result.unitid = `${companySlug}/${section}/`;
    result.mime = 'HTML';

    if (section === 'news') {
      result.rtype = 'ARTICLE';
    } else if (section === 'patent') {
      result.rtype = 'RECORD';
    } else {
      result.rtype = 'RECORD';
    }

    return result;
  }

  return result;
});
