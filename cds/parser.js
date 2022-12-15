#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Corriere Della Sera
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

  if ((match = /^\/cronaca\/([a-z-]+)\/[a-z0-9-]+$/i.exec(path)) !== null) {
    // https://video.corriere.it/cronaca/ucciso-una-freccia-genova-testimone-gesto-esasperazione/5b8844ce-5ace-11ed-b909-d31977d24b2b
    result.rtype = 'VIDEO';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]+\/[a-z0-9_]+\/([a-z0-9-]+)\.shtml$/i.exec(path)) !== null) {
    // https://www.corriere.it/politica/22_novembre_02/meloni-norma-anti-rave-facebook-b5b0e806-5ac5-11ed-b909-d31977d24b2b.shtml
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/forward\.jsp$/i.test(path)) {
    // https://sitesearch.corriere.it/forward.jsp?q=putin#
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
