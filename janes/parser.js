#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Jane's
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

  if ((match = /^\/Janes\/Display\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://customer.janes.com/Janes/Display/JUAV9266-JUAV
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/Visualisation\/Display\/([0-9a-z-_]+)$/i.exec(path)) !== null) {
    // https://customer.janes.com/Visualisation/Display/FG_2727647-JTIR
    result.rtype    = 'TOOL';
    result.mime     = 'GIF';
    result.unitid   = match[1];
  } else if ((match = /^\/Map$/i.exec(path)) !== null) {
    // https://customer.janes.com/Map?f=latlongs(21.24638%2C-126.80870%7C%7C59.42161%2C8.19130)&pg=1
    result.rtype    = 'MAP';
    result.mime     = 'GIF';
  } else if ((match = /^\/janes\/search$/i.exec(path)) !== null) {
    // https://customer.janes.com/janes/search?q=F-22A&pg=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-z]+)\/search$/i.exec(path)) !== null) {
    // https://customer.janes.com/DefenceBudgetsReports/search?q=Germany&pg=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
