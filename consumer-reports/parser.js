#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Consumer Reports
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

  if ((match = /^\/search\/$/i.exec(path)) !== null) {
    // https://www.consumerreports.org/search/?query=macbook%20air
    //https://www.consumerreports.org/search/?query=macbook%20air&n=section:Electronics
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/cro\/([a-z]+)\.htm$/i.exec(path)) !== null) {
    // https://www.consumerreports.org/cro/computers.htm
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/([a-z-]+)\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://www.consumerreports.org/car-recalls-defects/car-recall-guide-questions-answered/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_title = match[2];
  } else if ((match = /^\/products\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.consumerreports.org/products/computers-28965/laptop-28701/microsoft-surface-go-2-401329/
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.publication_title = match[3];
  }

  return result;
});
