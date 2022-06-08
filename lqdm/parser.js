#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Le Quotidien du médecin
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

  if (/^\/recherche$/i.test(path)) {
    // /recherche?search_text_form=covid&changed%5Bmin%5D%5Bdate%5D=&changed%5Bmax%5D%5Bdate%5D=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/[a-z-]+\/[a-z-]+\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /specialites/gynecologie-obstetrique/contraception-masculine-une-pilule-non-hormonale-efficace-99-chez-la-souris
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
