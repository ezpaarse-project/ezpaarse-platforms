#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Brepols Online
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
    // https://www.brepolsonline.net/action/doSearch?AllField=medieval&ConceptID=
    // https://www.brepolsonline.net/action/doSearch?startPage=0&KeywordRaw=&ContribRaw=&target=default&text1=iron&field1=AllField&Ppub=&AfterYear=&BeforeYear=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/doi\/abs\/(10.[a-z0-9]+)\/([a-z0-9.]+)$/i.exec(path)) !== null) {
    // https://www.brepolsonline.net/doi/abs/10.1484/J.JUA.5.120913
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.doi      = `${match[1]}/${match[2]}`;
  } else if ((match = /^\/doi\/book\/(10.[a-z0-9]+)\/([a-z0-9-.]+)$/i.exec(path)) !== null) {
    // https://www.brepolsonline.net/doi/book/10.1484/m.sa-eb.6.09070802050003050401080309
    // https://www.brepolsonline.net/doi/book/10.1484/m.rrr-eb.5.107026
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

    let isbn;
    if ((isbn = /^([a-z0-9-.]+?(\.([0-9]+)))$/i.exec(match[2])) !== null) {
      if (isbn[3].length > 6) {
        result.rtype = 'BOOK';
        result.mime  = 'PDF';
      }
    }

    result.unitid   = match[2];
    result.doi      = `${match[1]}/${match[2]}`;
  } else if ((match = /^\/doi\/epdf\/(10.[a-z0-9]+)\/((J|M).[a-z0-9-.]+)$/i.exec(path)) !== null) {
    if (match[3].toLowerCase() === 'j') {
      // https://www.brepolsonline.net/doi/epdf/10.1484/J.JUA.5.120913
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    }

    if (match[3].toLowerCase() === 'm') {
      // https://www.brepolsonline.net/doi/epdf/10.1484/M.RRR-EB.5.107026
      // https://www.brepolsonline.net/doi/epdf/10.5555/M.MON-EB.4.000599
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'PDF';
    }

    result.unitid   = `${match[2]}`;
    result.doi      = `${match[1]}/${match[2]}`;
  }

  return result;
});
