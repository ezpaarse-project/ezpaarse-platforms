#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform GuideStar
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

  if (((match = /^\/search$/i.exec(path)) !== null) || ((match = /^\/search\/SubmitSearch$/i.exec(path)) !== null)) {
    // https://www.guidestar.org:443/search
    // https://www.guidestar.org:443/search/SubmitSearch
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/profile\/([0-9-]+)$/i.exec(path)) !== null) {
    // https://www.guidestar.org:443/profile/13-1915124
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/PDF_Images\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9A-z-]+)\.pdf$/i.exec(path)) !== null) {
    // https://pdf.guidestar.org:443/PDF_Images/2003/481/102/2003-481102881-1-9.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.title_id = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4];
    result.unitid   = match[4];
  } else if ((match = /^\/profile\/CompFtaPdfLocal\/([0-9-]+)$/i.exec(path)) !== null) {
    // https://www.guidestar.org:443/profile/CompFtaPdfLocal/48-1102881
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/Profile\/ViewCCPdf/i.exec(path)) !== null) {
    // https://www.guidestar.org:443/Profile/ViewCCPdf?ein=23-2451475
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.title_id = param.ein;
    result.unitid   = param.ein;
  }

  return result;
});
