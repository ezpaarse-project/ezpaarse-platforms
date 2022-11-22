#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform US Naval Institute
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

  if ((match = /^\/magazines\/([a-z-]+)\/([0-9]{4})\/[a-z]+$/i.exec(path)) !== null) {
    // https://www.usni.org/magazines/proceedings/2022/november
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.publication_date = match[2];
  } else if ((match = /^\/magazines\/([a-z-]+)\/([0-9]{4})\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.usni.org/magazines/proceedings/2022/november/recruiting-requires-bold-changes
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.publication_date = match[2];
    result.unitid   = match[3];
  } else if ((match = /^\/([0-9]{4})\/[0-9]{2}\/[0-9]{2}\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://news.usni.org/2022/11/17/south-korea-reveals-new-unmanned-navy-sea-ghost-concept
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_date = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/magazines\/([a-z-]+)\/([0-9]{4})\/[a-z]+\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.usni.org/magazines/naval-history-magazine/2022/december/historys-first-torpedo-strike
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.publication_date = match[2];
    result.unitid   = match[3];
  } else if (/^\/search$/i.test(path)) {
    // https://www.usni.org/search?search_api_fulltext=innovation&sort_by=search_api_relevance&sort_order=DESC
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
