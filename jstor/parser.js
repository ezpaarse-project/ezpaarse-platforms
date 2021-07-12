#!/usr/bin/env node

/**
 * parser for the JSTOR platform
 * http://analyses.ezpaarse.org/platforms/jstor/
 */
'use strict';

const Parser = require('../.lib/parser.js');
const doiPrefix = '10.2307';

/**
 * Matching between the parameters found in openurl queries and EC fields
 */
const openUrlFields = {
  'issn': 'print_identifier',
  'isbn': 'print_identifier',
  'volume': 'vol',
  'issue': 'issue',
  'date': 'publication_date',
  'spage': 'first_page',
  'title': 'publication_title',
  'id': 'unitid'
};


module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let query  = parsedUrl.query;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  console.error(parsedUrl);

  let match;

  if ((match = /^\/journal\/([a-z0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/stable\/((10\.[0-9]+\/(978[0-9]{10})(_[a-z]+)?)(\.[0-9]+)?)$/i.exec(path)) !== null) {
    // Books containing an ISBN
    // https://www.jstor.org/stable/10.5149/9781469658070_neubauer
    // https://www.jstor.org/stable/10.7476/9788575413906
    // https://www.jstor.org/stable/10.7476/9788575413906.1

    result.unitid           = match[1];
    result.title_id         = match[2];
    result.doi              = match[2];
    result.print_identifier = match[3];
    result.mime             = 'HTML';
    result.rtype            = match[5] ? 'BOOK_SECTION' : 'TOC';

  } else if ((match = /^\/stable\/pdf\/((10\.[0-9]+\/(978[0-9]{10})(_[a-z]+)?)\.[0-9]+)\.pdf$/i.exec(path)) !== null) {
    // Books containing an ISBN downloads
    // https://www.jstor.org/stable/pdf/10.5149/9781469657486_erlin.2.pdf
    // https://www.jstor.org/stable/pdf/10.7476/9788575413906.1.pdf

    result.unitid           = match[1];
    result.title_id         = match[2];
    result.doi              = match[2];
    result.print_identifier = match[3];
    result.mime             = 'PDF';
    result.rtype            = 'BOOK_SECTION';

  } else if ((match = /^\/stable\/((10\.[0-9]+\/(j\.|mpub\.|)[a-z0-9]+)(\.[0-9]+)?)$/i.exec(path)) !== null) {
    // Books starting with j. (JSTOR) mpub. (Michigan Publishing) and neither
    // https://www.jstor.org/stable/10.2307/j.ctt1xp3ks7
    // https://www.jstor.org/stable/10.7249/mg1114fps
    // https://www.jstor.org/stable/10.3998/mpub.11649332
    // https://www.jstor.org/stable/10.2307/j.ctt1xp3ks7.3
    // https://www.jstor.org/stable/10.7249/mg1114fps.4

    result.unitid   = match[1];
    result.title_id = match[2];
    result.doi      = match[2];
    result.mime     = 'HTML';
    result.rtype    = match[4] ? 'BOOK_SECTION' : 'TOC';

  } else if ((match = /^\/stable\/pdf\/((10\.[0-9]+\/(j\.|mpub\.|)[a-z0-9]+)\.[0-9]+)\.pdf$/i.exec(path)) !== null) {
    // Books starting with j. (JSTOR) mpub. (Michigan Publishing) and neither downloads
    // https://www.jstor.org/stable/pdf/10.3998/mpub.11649332.1.pdf
    // https://www.jstor.org/stable/pdf/10.2307/j.ctt1xp3ks7.3.pdf
    // https://www.jstor.org/stable/pdf/10.7249/mg1114fps.4.pdf

    result.unitid   = match[1];
    result.title_id = match[2];
    result.doi      = match[2];
    result.mime     = 'PDF';
    result.rtype    = 'BOOK_SECTION';

  } else if ((match = /^\/stable\/((j\.[a-z0-9]+)(\.[0-9]+)?)$/i.exec(path)) !== null) {
    // JSTOR book redirects
    // https://www.jstor.org/stable/j.ctt1xp3ks7
    // https://www.jstor.org/stable/10.2307/j.ctt1xp3ks7.3
    // to
    // https://www.jstor.org/stable/j.ctt1xp3ks7.3

    result.unitid   = doiPrefix + '/' + match[1];
    result.title_id = doiPrefix + '/' + match[2];
    result.doi      = doiPrefix + '/' + match[2];
    result.mime     = 'HTML';
    result.rtype    = match[3] ? 'BOOK_SECTION' : 'TOC';

  } else if ((match = /^\/stable\/pdf\/((j\.[a-z0-9]+)\.[0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.jstor.org/stable/pdf/j.ctt1xp3ks7.3.pdf

    result.unitid   = match[1];
    result.title_id = match[2];
    result.doi      = '10.2307/' + match[2];
    result.mime     = 'PDF';
    result.rtype    = 'BOOK_SECTION';

  } else if ((match = /^\/stable\/(10\.[0-9]+\/(([a-z]+)(\.([0-9]{4}))?\.([0-9]+)(\.([0-9]+))?\.(issue-)?([0-9]+)(\.[0-9]+)?))$/i.exec(path)) !== null) {
    // /stable/10.5621/sciefictstud.43.issue-3
    // /stable/10.1525/ncm.2009.33.1.003?seq=1
    // /stable/10.1525/cmr.2013.55.issue-2
    // /stable/10.5325/jmedirelicult.39.2.issue-2
    result.doi      = match[1];
    result.unitid   = match[2];
    result.title_id = match[3];
    result.issue    = match[9] ? match[10] : match[8];
    result.rtype    = match[9] ? 'TOC' : 'ARTICLE';
    result.mime     = 'HTML';
    result.vol = match[6];

    if (match[5]) {
      result.publication_date = match[5];
    }

  } else if ((match = /^\/stable\/(10\.[0-9]+\/([a-z0-9_]+))$/i.exec(path)) !== null) {
    // /stable/10.1086/665036
    // /stable/10.7312/cari13424
    result.title_id = match[2];
    result.unitid   = match[2];
    result.doi      = match[1];
    result.mime     = 'HTML';

    if (match[2]) {
      result.doi = match[1];
    }

  } else if ((match = /^\/stable\/((resrep[0-9]+)(\.[0-9]+)?)$/i.exec(path)) !== null) {
    // /stable/resrep12068
    // /stable/resrep12068.5
    result.title_id = match[2];
    result.unitid   = match[1];
    result.mime     = 'HTML';
    result.rtype    = match[3] ? 'BOOK_SECTION' : 'TOC';

  } else if ((match = /^\/stable\/((i|e)?[0-9]+)$/i.exec(path)) !== null) {
    // /stable/e26611726
    // /stable/i25703249
    result.title_id = match[1];
    result.unitid   = match[1] ;
    result.mime     = 'HTML';

    if (match[1].startsWith('i') || match[1].startsWith('e')) {
      result.rtype = 'TOC';
    }

  } else if (/^\/action\/showPublication$/i.test(path)) {
    // /action/showPublication?journalCode=harvardreview
    if (query.journalCode) {
      result.title_id = query.journalCode;
      result.unitid   = query.journalCode;
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/stable\/(pdf|pdfplus)\/((10\.[0-9]+\/)?([a-z0-9.]+?))(?:\.pdf)?$/i.exec(path)) !== null) {
    // /stable/pdfplus/690326.pdf
    // /stable/pdf/10.13110/merrpalmquar1982.59.2.0198.pdf
    // /stable/pdf/10.1525/gfc.2010.10.4.cover.pdf
    // /stable/pdf/10.1525/gfc.2010.10.4.98a.pdf

    result.unitid = match[4];
    result.doi    = match[3] ? match[2] : `${doiPrefix}/${match[2]}`;
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';

    const idPattern = /^([a-z0-9]+)((?:\.(\d+))?\.(\d+)\.(\d+)\.(\w+))?/.exec(result.unitid) || [];

    result.title_id         = idPattern[1];
    result.publication_date = idPattern[3];
    result.vol              = idPattern[4];
    result.issue            = idPattern[5];

    if (idPattern[6] === 'cover') {
      return {};
    } else if (idPattern[6] === 'toc') {
      result.rtype = 'TOC';
    } else {
      const firstPage = parseInt(idPattern[6]);

      if (!isNaN(firstPage)) {
        result.first_page = firstPage.toString();
      }
    }

  } else if ((match = /^\/stable\/(info|view)\/([0-9]+)$/i.exec(path)) !== null) {
    // /stable/info/25703252
    // /stable/view/25703252
    result.title_id = match[2];
    result.unitid   = match[2];
    result.rtype    = match[1] === 'info' ? 'ABS' : 'PREVIEW';
    result.mime     = 'HTML';

  } else if (path.toLowerCase() === '/openurl') {
    // https://www.jstor.org/openurl?volume=34&aulast=Draper%2C+John+W&date=1937&spage=176&issn=00393738
    // https://www.jstor.org/openurl?volume=335&aulast=SUMMERFIELD%2C+Q&date=1992&spage=71&issn=09628436&issue=1273
    // https://www.jstor.org/openurl?volume=38&aulast=Gerald+Finkielsztejn&aulast=%D7%92%27%D7%A8%D7%90%D7%9C%D7%93+%D7%A4%D7%99%D7%A0%D7%A7%D7%9C%D7%A9%D7%98%D7%99%D7%99%D7%9F&date=1999&spage=51&issn=07928424
    // https://www.jstor.org/openurl?volume=36&date=2000&spage=610&issn=10437797&issue=3
    // https://www.jstor.org/openurl?volume=47&aulast=Gaugler%2C+JE&aulast=Yu%2C+F&aulast=Krichbaum%2C+K&date=2009&spage=606&issn=00257079&issue=5
    // https://www.jstor.org/openurl?aulast=Moskowitz%2C+Milton&date=2010&spage=86&issn=10773711&issue=67

    result.rtype = 'OPENURL';
    result.mime  = 'HTML';

    for (const key in param) {
      const matchingValue = openUrlFields[key];

      if (matchingValue) {
        result[matchingValue] = param[key];
      }
    }

    if (param.pages) {
      const pagesMatch = /^(\d+)-(\d+)$/.exec(param.pages);

      if (pagesMatch) {
        result.first_page = pagesMatch[1];
        result.last_page  = pagesMatch[2];
      }
    }

    if (result.unitid && result.unitid.toLowerCase().startsWith('doi:')) {
      result.doi = result.unitid = result.unitid.substr(4);
    }
  }

  return result;
});
