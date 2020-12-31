#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chemische Feitelijkheden
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

  if ((match = /^\/files\/([0-9a-z]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.chemischefeitelijkheden.nl/files/4198b5866bd9dc649ad35758a9bccf7a.pdf
    // https://www.chemischefeitelijkheden.nl/files/7d49517a82f3edae30ec9c66d721a931.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/artikelen\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://www.chemischefeitelijkheden.nl/artikelen/botox
    // https://www.chemischefeitelijkheden.nl/artikelen/alcohol-6
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://www.chemischefeitelijkheden.nl/search?search-results-search=Botox
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
