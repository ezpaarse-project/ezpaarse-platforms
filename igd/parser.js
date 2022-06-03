#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Institute of Grocery Distribution
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let host = parsedUrl.host;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://retailanalysis.igd.com/search?q=alibab#gsc.tab=0&gsc.q=alibab&gsc.page=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = host.split('.')[0];

  } else if ((match = /^\/retailers\/aeon\/news\/news-article\/t\/([0-9a-z-]+)\/i\/[0-9]+$/i.exec(path)) !== null) {
    // https://retailanalysis.igd.com/retailers/aeon/news/news-article/t/ocado-retail-sales-46-as-group-losses-widen/i/29385
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.db_id = host.split('.')[0];
  }

  return result;
});
