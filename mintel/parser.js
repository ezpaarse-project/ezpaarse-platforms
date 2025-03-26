#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mintel
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // Parameters are needed for this parser
  let param = parsedUrl.query || {};
  let hostname = parsedUrl.hostname;
  let match;

  // use console.error for debugging
  // console.error(parsedUrl);

  // Handle academic.mintel.com domain
  if (hostname === 'academic.mintel.com') {
    if ((match = /^\/display\/([0-9]+)$/i.exec(path)) !== null) {
      // https://academic.mintel.com/display/479826
      result.rtype    = 'REPORT';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    } else if (path === '/') {
      // https://academic.mintel.com/
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }
  }
  // Handle clients.mintel.com domain
  else if (hostname === 'clients.mintel.com') {
    if ((match = /^\/report\/([a-z0-9-]+)$/i.exec(path)) !== null) {
      // https://clients.mintel.com/report/airlines-uk-2024
      result.rtype    = 'REPORT';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
    else if ((match = /^\/content\/report\/([a-z0-9-]+)$/i.exec(path)) !== null) {
      // https://clients.mintel.com/content/report/electric-and-hybrid-cars-uk-2023
      result.rtype    = 'REPORT';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
    else if ((match = /^\/article\/workspace_SpacesStore_([a-f0-9-]+)\/?$/i.exec(path)) !== null) {
      // https://clients.mintel.com/article/workspace_SpacesStore_516bf1b6-3fd4-4cac-a820-96d1949c0ee4/
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = `workspace_SpacesStore_${match[1]}`;
    }
    else if ((match = /^\/content\/trend\/([a-z0-9-]+)$/i.exec(path)) !== null) {
      // https://clients.mintel.com/content/trend/trend-driver-insight-surroundings
      result.rtype    = 'ANALYSIS';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
    else if ((match = /^\/data\/consumer$/i.exec(path)) !== null) {
      // https://clients.mintel.com/data/consumer
      result.rtype    = 'DATASET';
      result.mime     = 'HTML';
      result.unitid   = 'consumer';
    }
    else if (path === '/') {
      // https://clients.mintel.com/
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }
    else if (path === '/my-account') {
      // https://clients.mintel.com/my-account
      result.rtype    = 'RECORD';
      result.mime     = 'HTML';
    }
    else if (path === '/' && param.contentType) {
      // https://clients.mintel.com/?contentType=Report&filters.category=3&last_filter=category
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';

      // Extract content type
      if (param.contentType) {
        result.content_type = param.contentType;
      }

      // Extract search terms if present
      if (param.freetext) {
        result.query = param.freetext;
      }
    }
  }

  // Handle reports.mintel.com domain
  else if (hostname === 'reports.mintel.com') {
    if ((match = /^\/display\/([0-9]+)$/i.exec(path)) !== null) {
      // https://reports.mintel.com/display/1155195/
      result.rtype    = 'REPORT';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
    else if (path === '/') {
      // https://reports.mintel.com/
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }
    else if (path === '/trends/') {
      // https://reports.mintel.com/trends/
      result.rtype    = 'ANALYSIS';
      result.mime     = 'HTML';
    }
  }

  // Handle data.mintel.com domain
  else if (hostname === 'data.mintel.com') {
    if ((match = /^\/databook\/([0-9]+)\/$/i.exec(path)) !== null) {
      // https://data.mintel.com/databook/1155195/
      result.rtype    = 'DATASET';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
    else if ((match = /^\/databook\/([a-z0-9-]+)\/$/i.exec(path)) !== null) {
      // https://data.mintel.com/databook/attitudes-towards-healthy-eating-uk-2024/
      result.rtype    = 'DATASET';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
  }

  // Handle marketsizes.mintel.com domain
  else if (hostname === 'marketsizes.mintel.com') {
    if ((match = /^\/query\/([0-9]+)\/performance\/market$/i.exec(path)) !== null) {
      // https://marketsizes.mintel.com/query/201830455/performance/market
      result.rtype    = 'DATASET';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
    else if ((match = /^\/snapshots\/([A-Z]+)\/([0-9]+)\/performance\/single$/i.exec(path)) !== null) {
      // https://marketsizes.mintel.com/snapshots/GBR/279/performance/single
      result.rtype    = 'DATASET';
      result.mime     = 'HTML';
      result.unitid   = match[2];
      result.publication_location = match[1];
    }
    else if (path === '/') {
      // https://marketsizes.mintel.com/
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }
  }

  // Handle store.mintel.com domain
  else if (hostname === 'store.mintel.com') {
    if ((match = /^\/report\/([a-z0-9-]+)$/i.exec(path)) !== null) {
      // https://store.mintel.com/report/global-outlook-sustainability-consumer-study
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }
  }

  // Handle help.mintel.com domain
  else if (hostname === 'help.mintel.com') {
    if (path === '/en/') {
      // https://help.mintel.com/en/
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }
    else if ((match = /^\/en\/articles\/([0-9]+)-(.+)$/i.exec(path)) !== null) {
      // https://help.mintel.com/en/articles/6193685-consumer-data-methodology
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = match[1];
      result.title_id = match[2];
    }
  }

  return result;
});