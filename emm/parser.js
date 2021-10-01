#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Edizioni Minerva Medica
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/[a-z]+\/getfreepdf\/([^.]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.minervamedica.it/en/getfreepdf/ZU9wZGRZNENRVHBPSFVUN1E2QTBlR1FWdmI0Ymx1N3BET0tIaWo3SERXOFJ6MVU5ZWJZTUh4SGY4WFU5bGJOcA%253D%253D/R40Y2021N08A1081.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]+\/journals\/([a-z-]+)\/article\.php$/i.exec(path)) !== null) {
    // https://www.minervamedica.it/en/journals/sports-med-physical-fitness/article.php?cod=R40Y9999N00A21092105
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = param.cod;
  }

  return result;
});
