#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Le Figaro
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/reader\/[a-z0-9-]+$/i.exec(path)) !== null) {
    // /reader/d6a0444a-897e-43d6-89f9-a971c71a99a6?origin=%2Fcatalog%2Fle-figaro%2Fle-figaro%2F2022-04-27
    result.rtype = 'ISSUE';
    result.mime = 'HTML';
    result.unitid = param.origin;
    let date;
    if ((date = /([0-9]+-[0-9]{2}-[0-9]{2})$/i.exec(param.origin)) !== null) {
      result.publication_date = date[1];
    }

  } else if (/^\/recherche\/(?!\/).+\/?$/i.test(path)) {
    // /recherche/covid/
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/[a-z]+\/[a-z]+\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /elections/presidentielles/presidentielle-2022-le-desarroi-des-candidats-face-a-la-campagne-impossible-20220324
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
