#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform National Center for Biotechnology Information
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


  if ((match = /^\/[a-z]+(\/advanced)?\/?$/i.exec(path)) !== null) {
    // /pubmed/advanced
    // /pubmed/?term=blood
    result.rtype = match[1] ? 'SEARCH' : 'TOC';
    result.mime  = 'HTML';

  } else if ((match = /^\/([a-z]+)\/([a-z0-9]+)\/?$/i.exec(path)) !== null) {
    // /pubmed/28750474
    // /books/NBK435759/

    if (!/^[a-z]+$/.test(match[2])) {
      result.mime   = 'HTML';
      result.rtype  = match[1] === 'books' ? 'BOOK_SECTION' : 'ABS';
      result.unitid = match[2];
    }

  } else if ((match = /^\/([a-z]+)(?:\/articles)?\/([a-z0-9]+)\/pdf\/([a-z0-9_-]+)\.pdf$/i.exec(path)) !== null) {
    // /pmc/articles/PMC2378811/pdf/canfamphys00307-0091.pdf
    // /books/NBK236371/pdf/Bookshelf_NBK236371.pdf
    result.mime   = 'PDF';
    result.rtype  = match[1] === 'books' ? 'BOOK': 'ARTICLE';
    result.unitid = `${match[2]}/${match[3]}`;

  } else if ((match = /^\/[a-z]+\/(articles|issues)\/([a-z0-9]+)(\/epub)?\/?$/i.exec(path)) !== null) {
    // /pmc/articles/PMC2378811/?page=1
    // /pmc/articles/PMC3555666
    // /pmc/issues/247371/
    result.unitid = match[2];
    result.mime   = match[3] ? 'EPUB': 'HTML';

    if (match[1] === 'issues') {
      result.rtype = 'TOC';
      result.title_id = match[2];
    } else {
      result.rtype = param.page ? 'ARTICLE_SECTION' : 'ARTICLE';
    }

  }

  return result;
});
