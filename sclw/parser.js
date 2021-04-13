#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform South Carolina Lawyers Weekly
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/news\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-]+)\/?$/i.exec(path)) !== null) {
    //https://sclawyersweekly.com/news/2021/03/16/roof-worker-who-fell-through-skylight-settles-claims-for-8-5m/
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[4];

    result.publication_date = `${match[1]}-${match[2]}-${match[3]}`;

  } else if (/^\/$/i.test(path) && param.s) {
    // https://sclawyersweekly.com/?s=Car+Crash
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
