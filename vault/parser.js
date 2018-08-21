#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Vault Campus Edition
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/search-results/i.test(path)) {
    // http://www.vault.com:80/search-results?q=google&wt=comp
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/internship-rankings\/([a-z0-9-]+)/i.exec(path)) !== null) {
    // http://www.vault.com:80/internship-rankings/best-tech-engineering-internships/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/(internship_program||company-profiles||school_profiles)\/(.*)$/i.exec(path)) !== null) {
    // http://www.vault.com:80/internship_program/aerospace/boeing-company/overview
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];
  } else if (/^\/product.aspx$/i.test(path)) {
    // http://www.vault.com:80/product.aspx?isbn=9781438177014
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.print_identifier = param.isbn;
    result.unitid   = param.isbn;
  } else if ((match = /^\/(rankings-reviews|internship-programs|resumes|vault-guide.aspx|category.aspx|JobSeeker)(.*)$/i.exec(path)) !== null) {
    // http://www.vault.com:80/rankings-reviews
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (match[2] !== null) {
      result.title_id = match[1] + match[2];
    } else {
      result.title_id = match[1];
    }
  }

  return result;
});
