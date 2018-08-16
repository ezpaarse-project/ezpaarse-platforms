#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Statista
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

  if (/^\/(search|publication-finder)/i.test(path)) {
    // https://www.statista.com:443/search/?q=nutrition
    // https://www.statista.com:443/publication-finder?q=books&submit=&yearFrom=2001&yearTo=2018&idBranch=0&docType=0&numPages=0&charsPerPageTo=0&hq=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/study\/([0-9]+)\/([a-z-]+)/i.exec(path)) !== null) {
    // https://www.statista.com:443/study/22762/child-health-and-nutrition-statista-dossier/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/(markets|outlook|studies-and-reports|surveys|chartoftheday|dossier|customercloud)(.*)$/i.exec(path)) !== null) {
    // https://www.statista.com:443/markets/418/technology-telecommunications/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/(statistics|chart)\/([0-9]+)\/(.*)\/$/i.exec(path)) !== null) {
    // https://www.statista.com:443/statistics/480418/annual-household-expenditure-on-tablet-computers-canada/
    // https://www.statista.com:443/chart/14963/california-wildfires-inflict-structural-damage/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[3];
    result.unitid   = match[2];
  } else if (/^\/download\//i.test(path)) {
    // https://www.statista.com:443/download/MTUzMzMyMzYwMSMjNTIwMDA1IyMyMjc2MiMjMSMjbnVsbCMjU3R1ZHk=
    result.rtype    = 'REF';
    result.mime     = 'MISC';
  }

  return result;
});
