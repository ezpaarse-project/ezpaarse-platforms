#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Portfolio Management Research
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/content\/(([a-z]+)\/([0-9]+)\/([0-9]+)\/([0-9]+))\.full\.pdf$/i.exec(path)) !== null) {
    // /content/iijpormgmt/39/4/4.full.pdf
    // /content/iijpormgmt/50/1/82.full.pdf

    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.db_id = match[2];
    result.unitid = match[1];
    result.vol = match[3];
    result.issue = match[4];
    result.first_page = match[5];

  } else if ((match = /^\/content\/(([a-z]+)\/([0-9]+)\/([0-9]+))\/local\/complete-issue\.pdf$/i.exec(path)) !== null) {
    // /content/iijpormgmt/50/1/local/complete-issue.pdf
    // /content/iijpormgmt/45/6/local/complete-issue.pdf

    result.rtype = 'ARTICLES_BUNDLE';
    result.mime = 'PDF';
    result.db_id = match[2];
    result.unitid = match[1];
    result.vol = match[3];
    result.issue = match[4];

  } else if ((match = /^\/content\/([a-z]+)\/?$/i.exec(path)) !== null) {
    // /content/iijpormgmt/
    // /content/iijtrade
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/content\/(([a-z]+)\/([0-9]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /content/iijpormgmt/50/1/82
    // /content/iijtrade/13/4/119

    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.db_id = match[2];
    result.unitid = match[1];
    result.vol = match[3];
    result.issue = match[4];
    result.first_page = match[5];

  } else if (/^\/search$/i.test(path)) {
    // /search?sort_by=search_api_relevance_1&sort_order=DESC&items_per_page=10&f%5B0%5D=topics%3A91&query=Taxation&implicit-login=true
    // /search?sort_by=search_api_relevance_1&sort_order=DESC&items_per_page=10&f%5B0%5D=0&query=Risk%20Management&implicit-login=true

    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
