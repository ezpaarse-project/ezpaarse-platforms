#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Wetfeet
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/articles\/(.*)$/i.exec(path)) !== null) {
    // https://www.wetfeet.com:443/articles/the-weakness-question
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/guides\/(.*)$/i.exec(path)) !== null) {
    // https://www.wetfeet.com:443/guides/beat-the-street-investment-banking-interviews
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/questions\/(.*)$/i.exec(path)) !== null) {
    // https://www.wetfeet.com:443/questions/what-does-accenture-look-for-in-entry-level-employees
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/companies\/c\/(.*)$/i.exec(path)) !== null) {
    // https://www.wetfeet.com:443/companies/c/lvmh
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/polls/i.test(path)) {
    // https://www.wetfeet.com:443/polls/new
    result.rtype    = 'TOOL';
    result.mime     = 'HTML';
  } else if (/^\/articles$/i.test(path)) {
    // https://www.wetfeet.com:443/articles
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/guides$/i.test(path)) {
    // https://www.wetfeet.com:443/guides
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }

  return result;

});
