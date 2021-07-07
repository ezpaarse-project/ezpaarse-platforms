#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

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
      result.rtype  = 'ARTICLE';
    }
    if (param.format && param.format == 'pdf') {
      result.unitid = param.ids;
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }
    if (param.journal) {
      result.unitid = param.journal;
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
  } else if ((match = /^\/document\/([a-z0-9]+)$/i.exec(path)) !== null) {
    result.unitid = match[1];
    result.rtype  = 'JURISPRUDENCE';
    result.mime   = 'HTML';
  } else if ((match = /^\/document\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    result.unitid = match[1];
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
  }

  return result;
});
