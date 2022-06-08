#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tribune de Lyon
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

  if (/^\/$/i.test(path)) {
    // /?s=covid
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/([0-9]+)\/([0-9]{2})\/([0-9]{2})\/([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // /2022/03/23/notre-classement-des-meilleurs-lycees-publics-et-prives-de-lyon/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.publication_date = `${match[1]}-${match[2]}-${match[3]}`;
    result.unitid = match[4];
  }

  return result;
});
