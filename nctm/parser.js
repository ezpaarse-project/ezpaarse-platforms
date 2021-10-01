#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform v
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

  if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-]+)\.xml$/i.exec(path)) !== null && param.tab_body == 'pdf') {
    // https://pubs.nctm.org/view/journals/jrme/46/1/article-p88.xml?tab_body=pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid = match[4];
    result.vol = match[2];
    result.issue = match[3];

  } else if ((match = /^\/downloadpdf\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-]+)\.xml$/i.exec(path)) !== null) {
    // https://pubs.nctm.org/downloadpdf/journals/jrme/46/1/article-p88.xml
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid = match[4];
    result.vol = match[2];
    result.issue = match[3];

  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-]+)\.xml$/i.exec(path)) !== null && param.tab_body == 'contentSummary') {
    // https://pubs.nctm.org/view/journals/jrme/46/1/article-p88.xml?tab_body=contentSummary
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[4];
    result.vol = match[2];
    result.issue = match[3];

  } else if (/^\/search$/i.test(path)) {
    // https://pubs.nctm.org/search?q=learning&source=%2Fjournals%2Fjrme%2Fjrme-overview.xml
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    let titleMatch = /^\/journals\/([a-z]+)\/([a-z0-9-]+)\.xml$/i.exec(param.source);
    result.title_id = titleMatch[1];
  }

  return result;
});
