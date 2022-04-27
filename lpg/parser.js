#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Le Progrès
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

  if ((match = /^\/[a-z]+\/([0-9]+)\/([0-9]{2})\/([0-9]{2})\/([a-z-]+)$/i.exec(path)) !== null) {
    // /sante/2022/03/25/covid-qui-repart-en-fleche-le-respect-des-mesures-barrieres-reste-essentiel
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';

    result.publication_date = `${match[1]}/${match[2]}/${match[3]}`;
    result.unitid = match[4];

  } else if (/^\/recherche$/i.test(path)) {
    // /recherche?q=covid&x=-1&y=7&x=1&y=1
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/liseuse\/([A-Z0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // /liseuse/W01/20220326
    result.rtype = 'ISSUE';
    result.mime = 'HTML';

    result.unitid = `${match[1]}/${match[2]}`;
    result.publication_date = match[2];
  }

  return result;
});
