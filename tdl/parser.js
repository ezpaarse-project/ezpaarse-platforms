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
  let query = parsedUrl.query || {};

  let match;

  if (path === '/' && query.s) {
    // /?s=covid
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/([0-9]+)\/([0-9]{2})\/([0-9]{2})\/([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    // /2022/03/23/notre-classement-des-meilleurs-lycees-publics-et-prives-de-lyon/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.publication_date = `${match[1]}-${match[2]}-${match[3]}`;
    result.unitid = match[4];

  } else if ((match = /^\/[a-z0-9_-]+\/([a-z0-9_.-]+)\/?$/i.exec(path)) !== null) {
    // /societe/notre-classement-des-meilleurs-lycees-publics-et-prives-de-lyon/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
