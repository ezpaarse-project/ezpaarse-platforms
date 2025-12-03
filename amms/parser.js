#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Mathematical Society
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  // Skip static assets, CSS, JS, images, fonts
  if (/\.(css|js|jpg|jpeg|png|gif|svg|woff|woff2|ico|rss)$/i.test(path) ||
      /\/assets\//i.test(path) ||
      /\/css\//i.test(path) ||
      /\/js\//i.test(path) ||
      /\/images\//i.test(path) ||
      /\/fonts\//i.test(path) ||
      /\/MathJax\//i.test(path) ||
      /\/mathjax\//i.test(path) ||
      path === '/favicon.ico') {
    return result;
  }

  // MathSciNet API - Articles
  if ((match = /^\/mathscinet\/api\/articles\/([0-9]+)$/.exec(path)) !== null) {
    // https://mathscinet.ams.org/mathscinet/api/articles/4751180
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'METADATA';
    result.unitid   = match[1];
  }
  // MathSciNet API - Authors
  else if ((match = /^\/mathscinet\/api\/authors\/([0-9]+)$/.exec(path)) !== null) {
    // https://mathscinet.ams.org/mathscinet/api/authors/1024976
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'METADATA';
    result.unitid   = 'author_' + match[1];
  }
  // MathSciNet API - Publications search
  else if (/^\/mathscinet\/api\/publications\/search/.test(path)) {
    // https://mathscinet.ams.org/mathscinet/api/publications/search?query=...
    result.rtype    = 'SEARCH';
    result.mime     = 'JSON';
  }
  // MathSciNet API - Publications format (export)
  else if (/^\/mathscinet\/api\/publications\/format/.test(path)) {
    // https://mathscinet.ams.org/mathscinet/api/publications/format?formats=ams,bib,tex,end&ids=4751180
    result.rtype    = 'METADATA';
    result.mime     = 'MISC';
    if (param.ids) {
      result.unitid = param.ids;
    }
  }
  // MathSciNet API - Other API endpoints (facets, suggestions, etc.)
  else if (/^\/mathscinet\/api\//.test(path)) {
    // https://mathscinet.ams.org/mathscinet/api/authors/facets?query=...
    result.rtype    = 'METADATA';
    result.mime     = 'JSON';
  }
  // MathSciNet PDF (handles both mathscinet.ams.org and www.ams.org)
  else if ((match = /^\/mathscinet\/pdf\/([0-9]+)\.pdf$/.exec(path)) !== null) {
    // https://mathscinet.ams.org/mathscinet/pdf/3477652.pdf
    // http://www.ams.org/mathscinet/pdf/3477652.pdf?arg3=&...
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }
  // MathSciNet Author page
  else if ((match = /^\/mathscinet\/author/.exec(path)) !== null && param.authorId) {
    // https://mathscinet.ams.org/mathscinet/author?authorId=103935
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = 'authorId=' + param.authorId;
  }
  // MathSciNet Publications search page
  else if (/^\/mathscinet\/publications-search/.test(path)) {
    // https://mathscinet.ams.org/mathscinet/publications-search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }
  // MathSciNet Authors search page
  else if (/^\/mathscinet\/authors-search/.test(path)) {
    // https://mathscinet.ams.org/mathscinet/authors-search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }
  // MathSciNet serials PDF
  else if (/^\/msnhtml\/serials\.pdf$/.test(path)) {
    // https://mathscinet.ams.org/msnhtml/serials.pdf
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.unitid   = 'serials';
  }
  // MathSciNet root or other pages
  else if (/^\/mathscinet\/?$/.test(path) || /^\/mathscinet\/$/.test(path)) {
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';
  }
  // Journal articles - PDF
  else if ((match = /^\/journals\/([^/]+)\/([0-9]{4})-([0-9]+)-([0-9]+)\/([A-Z0-9-]+)\/([A-Z0-9-]+)\.pdf$/.exec(path)) !== null) {
    // https://www.ams.org/journals/cams/2025-05-01/S2692-3688-2025-00043-9/S2692-3688-2025-00043-9.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[6];
    result.title_id = match[1];
    result.vol      = match[3];
    result.issue    = match[4];
  }
  // Journal articles - HTML
  else if ((match = /^\/journals\/([^/]+)\/([0-9]{4})-([0-9]+)-([0-9]+)\/([0-9]+)\.html$/.exec(path)) !== null) {
    // https://www.ams.org/journals/abs/2025-46-01/1203.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '_' + match[2] + '_' + match[3] + '_' + match[4] + '_' + match[5];
    result.title_id = match[1];
    result.vol      = match[3];
    result.issue    = match[4];
  }
  // Journal abstracts - HTML
  else if ((match = /^\/journals\/abstracts\/([0-9]{4})-([0-9]+)-([0-9]+)\/([0-9]+)\/([0-9]+)\.html$/.exec(path)) !== null) {
    // https://www.ams.org/journals/abstracts/2025-46-01/1203/15.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = 'abs_' + match[1] + '_' + match[2] + '_' + match[3] + '_' + match[4] + '_' + match[5];
    result.vol      = match[2];
    result.issue    = match[3];
  }
  // Journal TOC - all issues
  else if ((match = /^\/journals\/([^/]+)\/all_issues\.html$/.exec(path)) !== null) {
    // https://www.ams.org/journals/cams/all_issues.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
  }
  // Journal TOC - home page
  else if ((match = /^\/journals\/([^/]+)\/home-([0-9]{4})\.html$/.exec(path)) !== null) {
    // https://www.ams.org/journals/cams/home-2025.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }
  // Journal issue page
  else if ((match = /^\/journals\/([^/]+)\/([0-9]{4})-([0-9]+)-([0-9]+)\/?$/.exec(path)) !== null) {
    // https://www.ams.org/journals/jams/2026-39-01/
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '_' + match[2] + '_' + match[3] + '_' + match[4];
    result.title_id = match[1];
    result.vol      = match[3];
    result.issue    = match[4];
  }
  // Journal viewer (SUGA)
  else if ((match = /^\/journals\/suga\/([0-9]{4})-([0-9]+)-([0-9]+)\/([A-Z0-9-]+)\/viewer\/?$/.exec(path)) !== null) {
    // https://www.ams.org/journals/suga/2023-36-01/S0898-9583-2023-00474-5/viewer
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[4];
    result.title_id = 'suga';
    result.vol      = match[2];
    result.issue    = match[3];
  }
  // Books - Memoirs PDF
  else if ((match = /^\/books\/memo\/([0-9]+)\/memo([0-9]+)\.pdf$/.exec(path)) !== null) {
    // https://www.ams.org/books/memo/1380/memo1380.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = 'memo_' + match[1];
    result.title_id = 'memo';
  }
  // Books - Translations PDF
  else if ((match = /^\/books\/trans2\/([0-9]+)\/([0-9]+)\/trans([0-9]+)-([0-9]+)\.pdf$/.exec(path)) !== null) {
    // https://www.ams.org/books/trans2/233/06/trans2233-06.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = 'trans2_' + match[1] + '_' + match[2];
    result.title_id = 'trans2';
  }
  // Books - Memoirs or Translations page
  else if ((match = /^\/books\/(memo|trans2)\/([0-9]+)\/?$/.exec(path)) !== null) {
    // https://www.ams.org/books/memo/1380
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '_' + match[2];
    result.title_id = match[1];
  }
  // Journals main page
  else if (path === '/journals' || path === '/journals/') {
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';
  }
  // MathSciNet link
  else if (path === '/mathscinet/' || path === '/mathscinet') {
    result.rtype    = 'SESSION';
    result.mime     = 'HTML';
  }
  // Legacy MathSciNet search interface
  // Publications search
  else if (/^\/mathscinet\/search\/publications\.html$/.test(path)) {
    // http://www.ams.org/mathscinet/search/publications.html?pg4=AUCN&s4=DEGOND&...
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }
  // Journals search
  else if (/^\/mathscinet\/search\/journals\.html$/.test(path)) {
    // http://www.ams.org/mathscinet/search/journals.html?journalName=asymptotic&Submit=Chercher
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }
  // Author search
  else if (/^\/mathscinet\/search\/author\.html$/.test(path)) {
    // http://www.ams.org/mathscinet/search/author.html?mrauthid=140565
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }
  // Journal document
  else if (/^\/mathscinet\/search\/journaldoc\.html$/.test(path)) {
    // http://www.ams.org/mathscinet/search/journaldoc.html?cn=Theory_and_Decision
    // http://www.ams.org/mathscinet/search/journaldoc.html?jc=MATHA
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
  }
  // Publication document
  else if (/^\/mathscinet\/search\/publdoc\.html$/.test(path)) {
    // http://www.ams.org/mathscinet/search/publdoc.html?mx-pid=3425937&...
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
  }

  return result;
});
