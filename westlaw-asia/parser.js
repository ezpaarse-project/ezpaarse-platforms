#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Westlaw Asia
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

  if ((match = /^\/document\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://launch.westlawasia.com/document/I293BB590255F45F8BA67010BA6843A00?srguid=i0ad6290300000183b3b9e28db4e40af1&fromSearch=true&offset=10
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if (/^\/search$/i.test(path)) {
    // https://launch.westlawasia.com/search?tocguid=IBEA761A18052419B9982D92B205B6B40
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
