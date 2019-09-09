#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Taylor et Francis
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query;

  let match;

  if ((match = /^\/doi\/(full|pdf|abs)\/([0-9.]+\/([0-9a-z./-]+))$/i.exec(path)) !== null) {
    result.doi    = match[2];
    result.unitid = match[3];

    if (/^[0-9]{8}/.test(match[3])) {
      result.print_identifier = match[3].substr(0, 4) + '-' + match[3].substr(4, 4);
      result.title_id = result.print_identifier;
    }

    switch (match[1].toUpperCase()) {
    case 'FULL':
      // /doi/full/10.1080/17400309.2013.861174#abstract
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'PDF':
      // /doi/pdf/10.1080/17400309.2013.861174
      // /doi/pdf/10.1179/amb.1991.38.1.1
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'ABS':
      // /doi/abs/10.1080/00039420412331273295
      // /doi/abs/10.1179/amb.1991.38.1.1
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    }
  } else if ((match = /^\/toc\/([a-z0-9]+)\/current$/i.exec(path)) !== null) {
    // /toc/gaan20/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/loi\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /loi/wjsa21
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/books(?:\/e)?\/([0-9X]+)$/i.exec(path)) !== null) {
    // /books/9780203005361
    // /books/e/9780203005361
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.online_identifier = match[1];

  } else if ((match = /^\/books(?:\/e)?\/([0-9X]+)\/chapters\/(10\.[0-9]+\/([0-9a-z-]+))$/i.exec(path)) !== null) {
    // /books/9780203005361/chapters/10.4324/9780203005361-9
    // /books/e/9780203005361/chapters/10.4324/9780203005361-9
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.doi    = match[2];
    result.unitid = match[3];
    result.online_identifier = match[1];

  } else if (/^\/v3\/content\/pdf-download$/i.test(path) && param.isbn) {
    // /v3/content/pdf-download?dac=C2010-0-27781-3&isbn=9781136888946&doi=10.4324/9780203840054-5
    result.mime = 'PDF';
    result.online_identifier = param.isbn;

    if (param.doi) {
      result.rtype = 'BOOK_SECTION';
      result.doi = param.doi;

      const doiMatch = /^10\.[0-9]+\/([a-z0-9-]+)$/.exec(param.doi);
      if (doiMatch) {
        result.unitid = doiMatch[1];
      }
    } else {
      result.rtype = 'BOOK';
      result.unitid = param.isbn;
    }

  }

  return result;
});
