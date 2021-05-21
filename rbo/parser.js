#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Red Book Online
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

  if (/^\/solr\/searchresults.aspx$/i.test(path)) {
    // https://redbook.solutions.aap.org/solr/searchresults.aspx?q=hay%20fever&restypeid=1&exPrm_fq=-GbosContainerID:(40)
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/chapter.aspx$/i.test(path)) {
    // https://redbook.solutions.aap.org/chapter.aspx?sectionid=189640115&bookid=2205#192299769
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.bookid + '-' + param.sectionid
  }

  return result;
});
