#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Extract rtype
 */
function determineRtype (param, result) {
  let idMatch;
  let ids = param.id || param.ids;
  idMatch = /^(.+)Ch[0-9]+$/.exec(ids);
  let idArray = ids.split(',');
  if (idMatch !== null) {
    if (idArray.length > 1) {
      result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    } else {
      result.rtype  = 'BOOK_SECTION';
    }
  } else {
    result.rtype  = 'ARTICLE';
  }
}

/**
 * Recognizes the accesses to the platform Kluwer Arbitration
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

  if ((match = /^\/CommonUI\/(([a-z-]*).aspx)$/.exec(path)) !== null) {
    //CommonUI/books.aspx
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

    if (param.book) {
      result.unitid = param.book;
    }
    if (param.id) {
      result.unitid = param.id;
    }
    if (param.format && param.format == 'pdf') {
      result.unitid = param.ids;
      result.mime   = 'PDF';
    }

    if (param.journal) {
      result.unitid = param.journal;
    }
    if (param.id || param.ids) {
      determineRtype(param, result);
    }
    if (/([a-z]+)-tool/.test(match[2])) {
      result.rtype = 'TOOL';
    }

  } else if ((match = /^\/([0-9]{4})\/([0-9]+)\/([0-9]+)\/([a-z0-9-]*)\/?$/.exec(path)) !== null) {
    //2016/08/22/even-innocent-clients-may-not-benefit-from-the-fraud-of-their-attorney-second-circuit-upholds-rico-judgment-in-favor-of-chevron/
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[4];
    result.publication_date = match[1];
  } else if ((match = /^\/document\/print$/i.exec(path)) !== null) {
    // /document/print?ids=KLI-KCC-1103101-n&title=PDF
    // /document/print?ids=KLI-KCC-1103101-n&title=PDF
    // /document/print?ids=KLI-KA-Paulsson-2016-Ch02%2CKLI-KA-Paulsson-2016-Ch03%2CKLI-KA-Paulsson-2016-Ch04%2CKLI-KA-Paulsson-2016-Ch05&pdf=
    result.mime   = 'PDF';

    if (param.id || param.ids) {
      determineRtype(param, result);
      result.unitid = param.id || param.ids;
    }

  } else if ((match = /^\/document\/download$/i.exec(path)) !== null) {
    // /document/download?ids=KLI-KA-Paulsson-2016-Ch03%2CKLI-KA-Paulsson-2016-Ch06%2CKLI-KA-Paulsson-2016-Ch07%2CKLI-KA-Paulsson-2016-b001&zip=

    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'ZIP';
  } else if ((match = /^\/document\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /document/ipn31829

    result.rtype  = 'JURISPRUDENCE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/document\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /document/kli-ka-ai-2020-01-002?title=Arbitration%20International
    // /document/KLI-KCC-1103103-n

    if (param.title && param.title !== 'PDF') {
      result.rtype = 'ARTICLE';
    } else {
      result.rtype  = 'BOOK_SECTION';
    }
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
