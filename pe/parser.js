#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform peuclid
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let hash   = parsedUrl.hash;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/download\/(pdf|pdfview)_[0-9]+\/([a-z.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://projecteuclid.org.insis.bib.cnrs.fr/download/pdfview_1/euclid.ndjfl/1427202973
    // http://projecteuclid.org.insis.bib.cnrs.fr/download/pdf_1/euclid.ndjfl/1427202973
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[3];
    result.title_id = match[2];

  } else if ((match = /^\/current\/([a-z.]+)$/i.exec(path)) !== null) {
    // http://projecteuclid.org.insis.bib.cnrs.fr/current/euclid.ndjfl
    // redirects to: https://projecteuclid.org/journals/notre-dame-journal-of-formal-logic/current
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];

  } else if ((match = /^\/([a-z.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://projecteuclid.org.insis.bib.cnrs.fr/euclid.ndjfl/1452520241
    // redirects to: https://projecteuclid.org/journals/notre-dame-journal-of-formal-logic/volume-57/issue-2/From-Closure-Games-to-Strong-Kleene-Truth/10.1215/00294527-3346590.full
    result.title_id = match[1];
    result.unitid   = match[2];

    if (hash) {
      result.rtype = 'TOC';
      result.mime  = 'MISC';
    } else {
      result.rtype = 'ABS';
      result.mime  = 'HTML';
    }
  }
  else if ((match = /^\/journals\/([a-z-]+)\/volume-([0-9]+)\/issue-([\w]+)(|\/([\w-]+)\/([\S]+)\.(short|full))$/i.exec(path)) !== null) {
    // Abstract for journals
    // https://projecteuclid.org/journals/notre-dame-journal-of-formal-logic/volume-57/issue-2/From-Closure-Games-to-Strong-Kleene-Truth/10.1215/00294527-3346590.full
    result.title_id = match[1];
    result.vol      = match[2];
    result.issue    = match[3];
    if (match[4] == '') {
      result.mime     = 'MISC';
      result.rtype    = 'TOC';
    }
    else {
      result.mime     = 'HTML';
      result.rtype    = 'ABS';
      result.publication_title = match[5];
      if (match[6].startsWith('10.')) {
        result.doi = match[6];
      }
    }
  }
  else if ((match = /^\/(journalArticle|ebook|accountAjax)\/Download$/i.exec(path)) !== null) {
    // PDF Download
    // https://projecteuclid.org/journalArticle/Download?urlid=10.1215%2F00294527-3346590
    var urlid = ('urlid' in param) ? param.urlid : param.URLId;
    result.mime  = 'PDF';
    result.rtype = (match[1] === 'journalArticle' | param.downloadType === 'journal article') ? 'ARTICLE' : 'BOOK_CHAPTER';
    if (param.isFullBook == 'True') {
      result.rtype = 'BOOK';
    }
    if (urlid.startsWith('10.')) {
      result.doi = urlid;
    }
    else {
      result.title_id = urlid;
    }
  }
  else if ((match = /^\/journals\/([\w-]+)\/current$/i.exec(path)) !== null) {
    // Current issue
    // https://projecteuclid.org/journals/notre-dame-journal-of-formal-logic/current
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
  }
  else if ((match = /^\/(ebooks|proceedings)\/([a-z-]+)\/([\w-]+)\/(toc|Chapter\/([\w-]+))\/([\S]+)$/i.exec(path)) !== null) {
    // https://projecteuclid.org/ebooks/institute-of-mathematical-statistics-lecture-notes-monograph-series/Optimality/toc/10.1214/09-LNMS57
    // https://projecteuclid.org/proceedings/advanced-studies-in-pure-mathematics/development-of-iwasawa-theory-the-centennial-of-k-iwasawa-s-birth/toc/10.2969/aspm/08610000
    result.publication_title = match[3];
    if (match[4] == 'toc') {
      result.rtype           = 'TOC';
      result.mime            = 'MISC';
    }
    else {
      result.rtype           = 'ABS';
      result.mime            = 'HTML';
    }
    if (match[6].startsWith('10.')) {
      result.doi = match[6];
    }
    else {
      result.title_id = match[6];
    }
  }
  return result;
});
