#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform University of Chicago Journals
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

  if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/action/doSearch?SeriesKey=aft&AllField=picasso
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/doi\/full\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/full/10.1086/676545
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/pdfplus\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/pdfplus/10.1086/449144
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDFPLUS';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/abs\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/abs/10.1086/449146
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/toc\/[a-z]*\/([0-9]*)\/([0-9]*)\//i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/toc/aft/2017/44/+
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.publication_date = match[1];
    result.issue    = match[2];
  }

  return result;
});
