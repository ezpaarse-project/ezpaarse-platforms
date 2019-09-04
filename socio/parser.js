#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sociometrics
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if (/^\/products$/i.test(path)) {
    // https://www.socio.com:443/products
    // https://www.socio.com:443/products?utf8=%E2%9C%93&keywords=potato&x=0&y=0
    // https://www.socio.com:443/products?utf8=%E2%9C%93&per_page=&search%5Bresource_type%5D%5B%5D=2&keywords=infant
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/products\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    // https://www.socio.com:443/products/data
    if (match[1] == 'data') {
      result.rtype  = 'SEARCH';
      result.mime   = 'HTML';
    } else if (match[1] !== 'data') {
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
      result.unitid = match[1];
    }

  } else if ((match = /^\/products\/([a-zA-Z0-9-]+)\/contents\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.socio.com:443/products/daappp-99/contents/4466
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/contents/' + match[2];

  } else if ((match = /^\/products\/([a-zA-Z0-9-]+)\/contents\/([a-zA-Z0-9_/-]+)$/i.exec(path)) !== null) {
    // https://www.socio.com:443/products/daappp-99/contents/4466/download
    // https://www.socio.com:443/products/mda-0103/contents/download_all
    result.rtype    = 'SUPPL';
    result.mime     = 'MISC';
    result.unitid   = match[1] + '/contents/' + match[2];

  } else if ((match = /^\/pdf_uploads\/file\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://www.socio.com:443/pdf_uploads/file/27/Clinic-Based_AIDS_Education_Program_Abstract.pdf?1509557833
    result.rtype    = 'ABS';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '/' + match[2];

  }

  return result;
});
