#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Emerald management ejournals archives et Business
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/series\/([a-z]+)$/i.exec(path)) !== null) {
    // /series/ail
    result.rtype    = 'BOOKSERIE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/doi\/([a-z]+)\/(10\.[0-9]{4,5}\/([A-Z]([0-9]{4}-[0-9]{4})\(?([0-9]{4})\)?[0-9]+))$/i.exec(path)) !== null) {
    // /doi/book/10.1108/S0065-2830%282012%2935
    // /doi/pdfplus/10.1108/S0882-614520170000034003

    result.doi               = match[2];
    result.unitid            = match[3];
    result.online_identifier = match[4];
    result.publication_date  = match[5];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'MISC';
      break;
    case 'book':
      result.rtype = 'BOOKSERIE';
      result.mime  = 'MISC';
      break;
    case 'full':
      result.mime  = 'HTML';
      result.rtype = 'ARTICLE';
      break;
    case 'pdfplus':
      result.mime  = 'PDFPLUS';
      result.rtype = 'ARTICLE';
      break;
    default:
      result.rtype = 'ARTICLE';
      result.mime  = 'MISC';
    }

  } else if ((match = /^\/loi\/([a-z]+)$/i.exec(path)) !== null) {
    // /loi/ejim
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/toc\/(([a-z]+)\/[0-9]+\/[0-9]+)/.exec(path)) !== null) {
    // /toc/ejim/18/3
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/doi\/([a-z]+)\/(10\.[0-9]{4,}\/(([a-z]*)[0-9-]+))$/i.exec(path)) !== null) {
    // /doi/abs/10.1108/EJIM-10-2013-0115
    // /doi/pdfplus/10.1108/14601061211272358

    result.unitid = match[3];
    result.doi    = match[2];

    if (match[4]) {
      result.title_id = match[4];
    }

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'MISC';
      break;
    case 'full':
      result.mime  = 'HTML';
      result.rtype = 'ARTICLE';
      break;
    case 'pdfplus':
      result.mime  = 'PDFPLUS';
      result.rtype = 'ARTICLE';
      break;
    default:
      result.rtype = 'ARTICLE';
    }

  } else if ((match = /^\/insight\/content\/doi\/(10\.[0-9]{4,}\/([a-z0-9-]+))\/full\/(pdf|html)$/i.exec(path)) !== null) {
    // /insight/content/doi/10.1108/13581980810918396/full/pdf?title=product-market-competition-regulation-and-dividend-payout-policy-of-malaysian-banks
    // /insight/content/doi/10.1108/13581980810918396/full/html

    result.rtype  = 'ARTICLE';
    result.mime   = match[3].toUpperCase();
    result.unitid = match[2];
    result.doi    = match[1];

  } else if ((match = /^\/insight\/publication\/issn\/(([0-9]{4}-[0-9]{3}[0-9x])\/vol\/([0-9]+)\/iss\/([0-9]+))$/i.exec(path)) !== null) {
    // /insight/publication/issn/1358-1988/vol/16/iss/4

    result.rtype             = 'TOC';
    result.mime              = 'HTML';
    result.unitid            = match[1];
    result.online_identifier = match[2];
    result.vol               = match[3];
    result.issue             = match[4];

  }

  return result;
});

