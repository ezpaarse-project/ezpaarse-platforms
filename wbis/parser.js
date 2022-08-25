#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform World Biographical Information System (WBIS)
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

  if ((match = /^\/biographic-document\/([a-z0-9-]+)(\/(pdf|images))?(\/[0-9]+)?$/i.exec(path)) !== null) {
    // /biographic-document/I571-906-3
    // /biographic-document/I571-906-3/pdf
    // /biographic-document/I571-906-3/images/1

    result.unitid = match[1];

    if (!match[3]) {
      result.mime = 'MISC';
      result.rtype = 'BIO';
    } else {
      switch (match[3]) {
      case 'pdf':
        result.mime = 'PDF';
        result.rtype = 'BIO';
        break;

      case 'images':
        result.mime = 'JPEG';
        result.rtype = 'BIO';
        break;
      }
    }
  } else if ((match = /^\/bibliographic-document\/([a-z0-9-]+)(\/(pdf))?$/i.exec(path)) !== null) {
    // /bibliographic-document/3528
    // /bibliographic-document/3528/pdf

    result.unitid = match[1];
    result.rtype = 'RECORD_VIEW';
    result.mime = 'MISC';

    if (match[3] && match[3] === 'pdf') {
      result.mime = 'PDF';
    }
  } else if ((match = /^\/microfiche-document\/([a-z0-9-_]+)\/([0-9]+)\/([0-9]+)(\/(download-pdf)\/([0-9-]+))?$/i.exec(path)) !== null) {
    // /microfiche-document/BaBA_2/0292/017
    // /microfiche-document/BaBA_2/0292/017/download-pdf/17-19

    result.title_id = match[1];
    result.unitid = match[2];
    result.rtype = 'BIO';
    result.mime = 'JPEG';

    if (match[5] && match[5] === 'download-pdf') {
      result.mime = 'PDF';
    }
  } else if (/^\/(biographic|bibliographic)-results$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
