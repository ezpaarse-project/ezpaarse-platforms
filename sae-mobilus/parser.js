#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doiPrefix = '10.4271';

/**
 * Recognizes the accesses to the platform SAE-Mobilus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let query = parsedUrl.query || {};
  let match;

  if (/^\/search\/?$/i.test(path)) {
    // /search/
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/download\/?$/i.test(path) && query.method === 'downloadDocument') {
    // /download/?saetkn=&method=downloadDocument&contentType=pdf&prodCode=03-12-05-0036&cid=1000421378
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';

    if (query.prodCode) {
      result.unitid = query.prodCode;
      result.doi = `${doiPrefix}/${query.prodCode}`;
    }

  } else if ((match = /^\/content\/([a-z0-9_.-]+)\/?$/i.exec(path)) !== null) {

    if (match[1].toLowerCase().startsWith('v')) {
      // /content/V126-4EJ/
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = match[1];
    } else {
      // /content/04-12-03-0015.1/
      // /content/2017-01-0799/
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
      result.unitid = match[1];
      result.doi    = `${doiPrefix}/${match[1]}`;
    }
  }

  return result;
});
