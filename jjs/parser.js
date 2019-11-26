#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Jewish Studies
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/contents\/search\/searchme/i.test(path)) || (/^\/archives\/keywords$/i.test(path))) {
    // https://www.jjs-online.net:443/contents/search/searchme:herod/year:/type:all/volume:/fpage:
    // https://www.jjs-online.net:443/archives/keywords
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/archives\/contents$/i.test(path)) {
    // https://www.jjs-online.net:443/archives/contents
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = 'contents';
    result.unitid   = 'contents';

  } else if ((match = /^\/archives\/volume\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.jjs-online.net:443/archives/volume/60
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/supplements\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://www.jjs-online.net:443/supplements/series_1
    // https://www.jjs-online.net:443/supplements/catalogue
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
    if (match[1] == 'catalogue') {
      result.rtype  = 'REF';
    }
    else {
      result.rtype  = 'ABS';
    }

  } else if ((match = /^\/archives\/(article|fulltext)\/([0-9]+)$/i.exec(path)) !== null) {
    result.title_id = match[2];
    result.unitid   = match[2];
    if (match[1] == 'article') {
      result.rtype  = 'REF';
      result.mime   = 'HTML';
    }
    else if (match[1] == 'fulltext') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }

  }

  return result;
});
