#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Orbis
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

  if ((match = /^\/version-20201210\/orbis\/[0-9]+\/Companies\/Search$/i.exec(path)) !== null) {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/version-20201210\/orbis\/([0-9]+)\/Companies\/Report$/i.exec(path)) !== null) {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/Report
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/version-20201210\/orbis\/([0-9]+)\/Companies\/report\/Index$/i.exec(path)) !== null && param.BookSection == 'TOC') {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/report/Index?format=_standard&BookSection=TOC&seq=0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/version-20201210\/orbis\/([0-9]+)\/Companies\/report\/Index$/i.exec(path)) !== null && param.BookSection !== 'TOC') {
    // https://orbis.bvdinfo.com/version-20201210/orbis/1/Companies/report/Index?format=_standard&BookSection=PROFILE&seq=0
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '-' + param.BookSection;
  }

  return result;
});
