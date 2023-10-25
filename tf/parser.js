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
  let hash   = parsedUrl.hash;

  let match;

  if ((match = /^\/doi\/(full|pdf|abs|epdf|pdfdirect)\/([0-9.]+\/([0-9a-z./-]+))$/i.exec(path)) !== null) {
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
    case 'EPDF':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'PDFDIRECT':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
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

  } else if ((match = /^\/(loi|toc)\/([a-z0-9]+)(\/[0-9]+)?(\/[0-9]+)?$/i.exec(path)) !== null) {
    // /loi/wjsa21
    // http://www.tandfonline.com/toc/wjsa21/39/10
    // http://www.tandfonline.com/loi/wjsa21?open=39&repitition=0#vol_39
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    if (hash) {
      result.unitid   = match[2] + hash;
    } else if (match[3] && match[4]) {
      result.unitid   = match[2] + match[3] + match[4];
    } else {
      result.unitid   = match[2];
    }

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

  } else if ((match = /^\/action\/(generateIssuePDFs|generateMultiplePDFs|downloadTable)$/i.exec(path)) !== null) {
    if (match[1] == 'downloadTable') {
      //https://www.tandfonline.com/action/downloadTable?id=T0001&doi=10.1080%2F14693062.2019.1605330&downloadType=CSV
      result.rtype  = 'TABLE';
      result.mime   = 'CSV';
      result.unitid = param.doi;
      result.doi = param.doi;
    } else {
      // https://www.tandfonline.com/action/generateIssuePDFs?dois=10.1080%2Frsih20.v032.i04
      // https://www.tandfonline.com/action/generateMultiplePDFs?dois=10.1080%2F17460263.2012.738610%2C10.1080%2F17460263.2012.759668%2C10.1080%2F17460263.2012.746850%2C10.1080%2F17460263.2012.746851
      result.rtype  = 'ARTICLES_BUNDLE';
      result.mime   = 'PDF';
      result.unitid = param.dois;
      result.doi = param.dois;
    }

  } else if (/^\/openurl$/i.test(path)) {
    // https://www.tandfonline.com/openurl?stitle=rsih20&genre=journal
    result.rtype  = 'OPENURL';
    result.mime   = 'HTML';
  } else if ((match = /^\/doi\/reader\/figures\/([0-9.]+\/([0-9a-z./-]+))$/i.exec(path)) !== null) {
    // https://www.tandfonline.com/doi/reader/figures/10.1080/14693062.2019.1605330
    result.rtype  = 'FIGURE';
    result.mime   = 'JPEG';
    result.unitid = match[2];
    result.doi = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://www.tandfonline.com/action/doSearch?AllField=sport+studies+in+Asia
    // https://www.tandfonline.com%2faction%2fdoSearch%3fAllField%3dsport%2bstudies%2bin%2bAsia
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
  }

  return result;
});
