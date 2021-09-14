#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bone and Joint Online
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

  if ((match = /^\/doi\/epdf\/(.+)$/i.exec(path)) !== null) {
    // https://online.boneandjoint.org.uk/doi/epdf/10.1302/0301-620X.103B8.BJJ-2020-1013.R2
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/doi\/full\/(.+)$/i.exec(path)) !== null) {
    // https://online.boneandjoint.org.uk/doi/full/10.1302/0301-620X.103B8.BJJ-2020-1013.R2
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/epub\/(.+)$/i.exec(path)) !== null) {
    // https://online.boneandjoint.org.uk/doi/epub/10.1302/0301-620X.103B8.BJJ-2020-1013.R2
    result.rtype    = 'ARTICLE';
    result.mime     = 'EPUB';
    result.unitid   = match[1];
  } else if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://online.boneandjoint.org.uk/action/doSearch?AllField=knee&SeriesKey=bjj
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
