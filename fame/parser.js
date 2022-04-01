#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Fame
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

  if (/^\/version-[0-9]+\/fame\/[0-9]+\/Companies\/Search$/i.test(path)) {
    // https://fame.bvdinfo.com/version-20211216/fame/1/Companies/Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/version-[0-9]+\/fame\/[0-9]+\/Companies\/Report\/Display\/_standard$/i.test(path)) {
    // https://fame.bvdinfo.com/version-20211216/fame/1/Companies/Report/Display/_standard?seq=0
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
  } else if (/^\/version-[0-9]+\/fame\/[0-9]+\/Companies\/report\/Index$/i.test(path)) {
    // https://fame.bvdinfo.com/version-20211216/fame/1/Companies/report/Index?format=_standard&BookSection=TOC&uniqueId=OC394781
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.uniqueId;
  }

  return result;
});
