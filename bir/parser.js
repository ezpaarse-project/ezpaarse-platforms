#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The British Institute of Radiology
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
    // https://www.birpublications.org/action/doSearch?AllField=bone
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/doi\/(?:(epub|pdf|epdfplus)\/)?(.+)$/i.exec(path)) !== null) {
    // https://www.birpublications.org/doi/10.1259/bjr.75.897.750743
    // https://www.birpublications.org/doi/epub/10.1259/bjr.75.897.750743
    // https://www.birpublications.org/doi/pdf/10.1259/bjr.75.897.750743
    // https://www.birpublications.org/doi/epdfplus/10.1259/bjr.75.897.750743

    result.rtype    = 'ARTICLE';
    if (match[1] == 'epub') {
      result.mime     = 'EPUB';
    } else if (match[1] == 'pdf') {
      result.mime     = 'PDF';
    } else if (match[1] == 'epdfplus') {
      result.mime     = 'PDFPLUS';
    } else if (match[1] == null) {
      result.mime     = 'HTML';
    }

    result.doi = match[2];
    result.unitid   = match[2];
  }

  return result;
});
