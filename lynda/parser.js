#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lynda.com
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

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://www.lynda.com/search?q=R
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/[0-9a-z-]+\/([0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://www.lynda.com/Design-training-tutorials/40-0.html
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/[0-9a-z-]+\/[0-9a-z-]+\/([0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://www.lynda.com/R-tutorials/Learning-R-Tidyverse/586672-2.html?srchtrk=index%3a7%0alinktypeid%3a2%0aq%3aR%0apage%3a1%0as%3arelevance%0asa%3atrue%0aproducttypeid%3a2
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z-]+\/[a-z-]+\/[0-9]+\/([0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://www.lynda.com/Adobe-Mobile-Apps-tutorials/Working-mobile/2832064/2324112-4.html
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
