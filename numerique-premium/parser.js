#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/content\/([a-z]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.numeriquepremium.com/content/books/9782728801749
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.title_id = match[1] + '/' + match[2];
    result.unitid = match[2];
  }

  if ((match = /^\/doi\/epdf\/(10.[0-9]+\/([a-z0-9-.]+))$/i.exec(path)) !== null) {
    // https://www.numeriquepremium.com/doi/epdf/10.14375/NP.9782072798238
    result.rtype = 'BOOK';
    result.mime = 'PDF';
    result.unitid = match[2];
    result.doi = match[1];
  }

  if ((match = /^\/doi\/book\/(10.[0-9]+\/([a-z0-9-.]+))$/i.exec(path)) !== null) {
    // https://www.numeriquepremium.com/doi/book/10.14375/NP.9782072798238#toc-containter
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.doi = match[1];
  }

  if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://www-numeriquepremium-com.ezpaarse.univ-paris1.fr/action/doSearch
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});

