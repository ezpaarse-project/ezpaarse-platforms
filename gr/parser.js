#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Global Regulation
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

  if ((match = /^\/[a-z]+\/[a-z-]+\/[0-9]+\/([a-z-]+)\.html$/i.exec(path)) !== null) {
    // https://www.global-regulation.com/translation/czech-republic/515360/declare-it-national-nature-heritage-jose-rocks.html?q=Rocks
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/search\.php$/i.exec(path)) !== null) {
    // https://www.global-regulation.com/search.php?year&country&province&category&start&q=Rocks&advanced=false
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
