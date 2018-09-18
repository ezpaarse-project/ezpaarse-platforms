#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const doiPrefix = '10.1071';

/**
 * Recognizes the accesses to the platform Csiro Publishing
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

  if ((match = /^\/([a-z]+)(\/(pdf|fulltext|acc))?\/([a-z0-9]+)(\/[a-z0-9_]+\.pdf)?$/i.exec(path)) !== null) {
    // /zo/pdf/ZO9820495
    // /zo/Fulltext/ZO17004
    // /BT/BT95063
    // /bt/acc/BT17081/BT17081_AC.pdf
    result.title_id = match[1];
    result.unitid = match[4];
    result.doi = `${doiPrefix}/${result.unitid}`;

    if (!match[3]) {
      result.mime = 'HTML';
      result.rtype = 'ABS';
    } else {
      switch (match[3].toLowerCase()) {
      case 'pdf':
        result.mime = 'PDF';
        result.rtype = 'ARTICLE';
        break;
      case 'fulltext':
        result.mime = 'HTML';
        result.rtype = 'ARTICLE';
        break;
      case 'acc':
        result.mime = 'PDF';
        result.rtype = 'SUPPL';
        break;
      }
    }

  } else if ((match = /^\/samples\/TOC_([a-z0-9%]+)\.pdf$/i.exec(path)) !== null) {
    // /samples/TOC_Australian Island Arks.pdf
    result.rtype = 'TOC';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/ebook\/chapter\/([a-z0-9_-]+)_([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // /ebook/chapter/9781486301614_Authors
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.print_identifier = match[1];
    result.unitid = `${match[1]}_${match[2]}`;
  }

  return result;
});
