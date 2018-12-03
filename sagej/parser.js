#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sage Journals
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

  if ((match = /^\/(loi|toc)\/(([a-z]+)\/?([0-9]+)?\/?([0-9]+)?)$/i.exec(path)) !== null) {
    //http://journals.sagepub.com/loi/adra
    //http://journals.sagepub.com/toc/adra/28/2
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[3];
    if (match[4]) {
      result.unitid   = match[2];
    }

  } else if ((match = /^\/doi\/([a-z]+)\/(([0-9]{2})\.([0-9]{4})\/([0-9a-z_]+))$/i.exec(path)) !== null) {
    //http://journals.sagepub.com/doi/full/10.1177/0022034516639276
    //http://journals.sagepub.com/doi/pdf/10.1177/0022034516639276
    //http://journals.sagepub.com/doi/figure/10.1177/0022034516639276?
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi = match[2];
    result.unitid   = match[5];
    switch (match[1]) {
    case 'pdf':
      result.mime     = 'PDF';
      break;
    case 'figure':
      result.rtype    = 'FIGURE';
      break;
    }
  }

  return result;
});
