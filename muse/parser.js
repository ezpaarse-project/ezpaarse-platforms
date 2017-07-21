#!/usr/bin/env node
'use strict';

const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/journals\/(([^/]+)\/(toc|summary)\/(.*)).html$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu/journals/george_herbert_journal/toc/ghj.34.1-2.html
    result.unitid   = match[1];
    result.title_id = match[2];
    result.mime     = 'MISC';
    result.rtype    = match[3] === 'toc' ? 'TOC' : 'ABS';

  } else if ((match = /^\/journals\/(([^/]+)\/[^/]+\/.*).(pdf|html)$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/journals/george_herbert_journal/v034/34.1-2.newton.pdf
    // http://muse.jhu.edu:80/journals/george_herbert_journal/v034/34.1-2.newton.html
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = match[3].toUpperCase();

  } else if ((match = /^\/journals\/([^/]+)\/$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/journals/american_catholic_studies/
    result.unitid   = match[1];
    result.title_id = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if (/^\/login$/.test(parsedUrl.pathname)) {
    // http://muse.jhu.edu/login?auth=0&type=summary&url=/journals/american_book_review/v034/34.4.irr.pdf
    if (param.type && param.url && param.type === 'summary') {
      let matchUrl = /^\/journals\/(([^/]+)\/(.*)).(pdf|html)/.exec(param.url);

      if (matchUrl) {
        result.unitid   = matchUrl[1];
        result.title_id = matchUrl[2];
        result.rtype    = 'ABS';
        result.mime     = 'MISC';
      }
    }
  } else if ((match = /^\/books\/([^/]+)$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/books/9781421401737
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[1];
    result.print_identifier = match[1];

  } else if ((match = /^\/books\/[^/]+\/(([^-]+)([-]?)(.*)).pdf$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/books/9781421401737/9781421401737-7.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.print_identifier = match[2];

  } else if ((match = /^\/(article|issue|journal|book|chapter)\/([0-9]+)(\/pdf)?$/.exec(parsedUrl.pathname)) !== null) {
    //http://muse.jhu.edu.gate3.inist.fr/article/627750
    result.unitid = match[2];

    switch (match[1]) {
    case 'article' :
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'issue' :
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    case 'book' :
    case 'journal' :
      result.title_id = match[2];
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    case 'chapter' :
      result.rtype = 'BOOK_SECTION';
      result.mime  = 'PDF';
      break;
    }

    if (match[3]) {
      result.mime = 'PDF';
    }
  }

  return result;
});