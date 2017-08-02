#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL    = require('url');

const doiPrefix = '10.1039';

/**
 * Identifie les consultations de la plateforme Royal Society of Chemistry
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
  let hashedUrl;

  if (parsedUrl.hash) {
    hashedUrl = URL.parse(parsedUrl.hash.replace('#!', '/?'), true);
  }

  if ((match = /^\/en\/journals\/journalissues\/([a-zA-Z]{2,})$/i.exec(path)) !== null) {
    // /en/journals/journalissues/ay
    // #!issueid=ay006014&type=current&issnprint=1759-9660
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];

    if (hashedUrl && hashedUrl.query) {
      if (hashedUrl.query.issnprint) { result.print_identifier = hashedUrl.query.issnprint; }
      if (hashedUrl.query.issueid) { result.unitid = hashedUrl.query.issueid; }
    }

  } else if ((match = /^\/en\/content\/article(html|pdf)\/([0-9]+)\/([a-z0-9]+)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /en/content/articlehtml/2014/rp/c4rp00006d
    result.rtype    = 'ARTICLE';
    result.mime     = match[1].toUpperCase();
    result.title_id = match[3].toLowerCase();
    result.unitid   = match[4].toLowerCase();
    result.doi      = `${doiPrefix}/${result.unitid}`;

    result.publication_date = match[2];

  } else if ((match = /^\/en\/content\/ebook\/([0-9-]+)$/i.exec(path)) !== null) {
    // /en/content/ebook/978-1-84973-424-0#!divbookcontent
    if (hashedUrl && hashedUrl.query && !hashedUrl.query.divbookcontent) {
      result.rtype = 'TOC';
    }

    result.mime             = 'MISC';
    result.unitid           = match[1].replace(/-/g, '');
    result.print_identifier = match[1].replace(/-/g, '');

  } else if ((match = /^\/en\/content\/chapterpdf\/([0-9]+)\/(([0-9]+)-[0-9]+)$/i.exec(path)) !== null) {
    // /en/content/chapterpdf/2013/9781849734738-00001?isbn=978-1-84973-424-0&sercode=bk
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'PDF';
    result.unitid = match[2];
    result.doi    = `${doiPrefix}/${match[2]}`;

    result.online_identifier = match[3];
    result.publication_date  = match[1];

    if (param.isbn) {
      result.print_identifier = param.isbn.replace(/-/g, '');
    }
  }

  return result;
});

