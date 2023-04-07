#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform 4 Canoes
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

  if ((match =/^\/shelf\/([a-z-]+)\/([a-z0-9-_]+)\.html$/i.exec(path)) !== null) {
    //https://4canoesportal.org/shelf/Haida/TheHaidaofHaidaGwaii_2022-11-07_15-24-05.html
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid = match[2];
  } else if (/^\/([a-z-]+)\/?$/i.test(path)) {
    // https://4canoes.com/focused-education-resources
    result.rtype    = 'QUERY';
    result.mime     = 'HTML';
  }

  return result;
});
