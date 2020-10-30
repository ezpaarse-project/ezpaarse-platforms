#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Neurosurgery
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  let match;

  if ((match = /^(\/[a-z]+)?\/view\/journals\/[a-z-]+\/(([0-9]+)\/([0-9]+)\/([a-z0-9-]+))\.xml$/i.exec(path)) !== null) {
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[2];
    result.vol    = match[3];
    result.issue  = match[4];
  }

  return result;
});
