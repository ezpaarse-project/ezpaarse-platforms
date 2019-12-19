#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform BCC Research
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param  = parsedUrl.query || {};
  let host   = parsedUrl.hostname;
  // console.error(parsedUrl);

  let match;

  if (/blog.bccresearch.com/i.test(host)) {
    if ((match = /^\/author\/([a-zA-Z0-9-]+)$/i.exec(path)) !==null) {
      // http://blog.bccresearch.com:80/author/clara-mouawad
      result.rtype    = 'BIO';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    } else if ((match = /^\/([a-zA-Z0-9-]+)$/i.exec(path)) !==null) {
      // http://blog.bccresearch.com:80/food-and-beverage-market-2019
      // http://blog.bccresearch.com:80/the-beginners-guide-to-video-for-academic-librarians
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = match[1];
    }


  } else if (/www.bccresearch.com/i.test(host)) {
    if (((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).html$/i.exec(path)) !==null) || ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).html$/i.exec(path)) !==null) || ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).html$/i.exec(path)) !==null)) {
      // https://www.bccresearch.com:443/partners/persistence-market-research/global-market-study-on-potato-starch.html
      // https://www.bccresearch.com:443/market-research/chemicals/biopesticides-chm029e.html
      // https://www.bccresearch.com:443/market-research/information-technology/geospatial-analytics-market-report.html
      // https://www.bccresearch.com:443/partners/verified-market-research/industrial-hearable-market-size-and-forecast.html
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      result.unitid   = match[4] || match[3] || match[2];
    } else if ((match = /^\/pressroom\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !==null) {
      // https://www.bccresearch.com:443/pressroom/hlc/bionics-market-to-see-111-annual-growth-through-2024
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = match[1] + '/' + match[2];
    } else if (/^\/([a-zA-Z0-9/-]+)$/i.test(path)) {
      // https://www.bccresearch.com:443/index/reportlookupsuggestsolr?q=potato
      // https://www.bccresearch.com:443/partners
      // https://www.bccresearch.com:443/collections/materials
      // https://www.bccresearch.com:443/collections/materials/page2
      // https://www.bccresearch.com:443/market-research/chemicals
      // https://www.bccresearch.com:443/partners/verified-market-research
      result.rtype    = 'SEARCH';
      result.mime     = 'MISC';
    }

  }

  return result;
});
