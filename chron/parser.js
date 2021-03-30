#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The Chronicle of Higher Education
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

  if ((match = /^\/article\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://www.chronicle.com/article/why-this-popular-college-guide-will-stop-publishing-act-and-sat-score-ranges
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if  ((match = /^\/blogs\/[0-9a-z-]+\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    //https://www.chronicle.com/blogs/live-coronavirus-updates/hundreds-of-illinois-higher-ed-workers-got-covid-19-vaccine-out-of-turn
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://www.chronicle.com/search?q=Library#nt=navsearch
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
