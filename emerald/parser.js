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

  } else if ((match = /^\/([a-z]+)\/article-pdf\/doi\/(10\.[0-9]{4,}\/[^/]+)\/([0-9]+)\/[^/]+\.pdf$/i.exec(path)) !== null) {
    // www.emerald.com journal paths — see test/emerald.2026-03-23.csv
    // /cpoib/article-pdf/doi/10.1108/cpoib-09-2025-0211/11329495/cpoib-09-2025-0211en.pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.doi   = match[2];
    result.unitid = match[3];

  } else if ((match = /^\/([a-z]+)\/article\/doi\/(10\.[0-9]{4,}\/[^/]+)\/([0-9]+)\/([^/]+)$/.exec(path)) !== null) {
    // /cpoib/article/doi/10.1108/…/1348846/What-are-emerging-markets-…  (?query handled outside pathname)
    result.rtype   = 'ARTICLE';
    result.mime    = 'HTML';
    result.doi     = match[2];
    result.unitid  = match[3];
    result.title_id = match[4];

  } else if ((match = /^\/([a-z]+)\/article-media\/([0-9]+)\/(pdfviewer|epubviewer)\/([0-9]+)$/.exec(path)) !== null) {
    // /:journal/article-media/:id/(pdfviewer|epubviewer)/:assetId — mime follows the viewer segment name
    result.rtype  = 'ARTICLE';
    result.unitid = match[2];
    result.mime   = match[3] === 'epubviewer' ? 'EPUB' : 'PDF';

  } else if ((match = /^\/([a-z]+)\/article-pdf\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([^/]+)\.pdf$/.exec(path)) !== null) {
    // /ijccsm/article-pdf/16/2/177/9515776/ijccsm-11-2022-0138.pdf
    result.rtype     = 'ARTICLE';
    result.mime      = 'PDF';
    result.vol       = match[2];
    result.issue     = match[3];
    result.first_page = match[4];
    result.unitid    = match[5];

  } else if ((match = /^\/([a-z]+)\/article\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([^/]+)$/.exec(path)) !== null) {
    // /ijccsm/article/16/2/177/1222325/Climate-change-and-crop-production-nexus-assessing
    result.rtype      = 'ARTICLE';
    result.mime       = 'HTML';
    result.vol        = match[2];
    result.issue      = match[3];
    result.first_page = match[4];
    result.unitid     = match[5];

  } else if ((match = /^\/books\/collection\/([0-9]+)\/[^/]+\/?$/.exec(path)) !== null) {
    // /books/collection/108947/Data-Science-eBooks-Select-75
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.unitid = match[1];

  } else if (path === '/search-results' || path === '/search-results/') {
    // ?page=&q=… via parsedUrl.query (not matched in pathname)
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});

