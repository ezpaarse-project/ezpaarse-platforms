#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Credo Reference
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/content\/title\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /content/title/routbiopsy?tab=entry_view&heading=bandura_albert&sequence=0
    // /content/title/ghabd
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/content\/browse\/(topic|title)$/i.exec(path)) !== null) {
    // /content/browse/topic?subject=107
    // /content/browse/title?subject=117
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/content\/entry\/(([a-z0-9]+)\/[a-z0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // /content/entry/cqpresshreh/iran/0

    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  }

  return result;
});
