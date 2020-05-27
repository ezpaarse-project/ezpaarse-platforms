#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform EPrints
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

  if ((match = /^(\/id\/eprint)?\/([0-9]+)\/([0-9]+)\/([a-z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /id/eprint/63/1/paper.pdf
    // /23104/1/Cruz-Ferreira_23104.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid = `${match[2]}/${match[3]}`;

  } else if ((match = /^(\/id\/eprint)?\/([0-9]+)\/?$/i.exec(path)) !== null) {
    // /id/eprint/63
    // /23104/
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  }
  return result;
});
