#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kortext
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if (/^\/reader\/pages$/i.test(path)) {
    //https://app.kortext.com/reader/pages?Book_Id=1723&_=1491551644441
    result.unitid = param.Book_Id;
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';

  } else if (/^\/reader\/(words|draw)$/i.test(path)) {
    //https://app.kortext.com/reader/words?n=1723&l=9&w=1580&_=1491551678648
    //https://app.kortext.com/reader/draw?n=1723&l=522&w=1580&p=502
    result.unitid = param.n;
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';

  } else if ((match = /^\/read\/([0-9]+)$/i.exec(path)) !== null) {
    // https://app.kortext.com/read/1723
    result.unitid = match[1];
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';

  } else if ((match = /^\/read\/([0-9]+)\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://app.kortext.com/read/1723/vi
    // https://app.kortext.com/read/1723/161
    result.unitid = match[1];
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';

  }

  return result;
});
