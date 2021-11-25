#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NNNConsult
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/([a-z]+)\/([0-9]+)(\/[a-z0-9]*)?/i.exec(path)) !== null) {
    // https://www.nnnconsult.com/nanda/16
    // https://www.nnnconsult.com/diagnosticosmedicos/7/
    // https://www.nnnconsult.com/noc/1808/D7/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.db_id    = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/buscador$/i.exec(path)) !== null) {
    // https://www.nnnconsult.com/buscador
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
