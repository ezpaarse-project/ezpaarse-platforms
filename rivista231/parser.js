#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

// Only NomeFile values that begin <issue>-<year>- carry their own metadata.
// The anchor is what keeps the other families out, and it matters: the journal
// is named for D.Lgs. 231/2001, so "231" turns up inside filenames as subject
// matter rather than as an issue number. A looser match would read
// Il-commissario-settoriale-decreto-231-04-2010.pdf as issue 231, and would
// read the 22 of Tesi-22-Indice.pdf as a year.
const ISSUE_YEAR = /^([A-Za-z]?[0-9]+)-([0-9]{4})-/;

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // Rivista231 is a single publication, so there is nothing between the
  // article and the platform. title_id is deliberately never set, and no
  // knowledge base applies. The journal does have an ISSN, 2282-5738, but it
  // appears in no URL, so print_identifier is not set from one either.

  // Full text of an article, delivered as a PDF.
  // /InviaDocumentoProtetto.asp?NomeFile=01-2006-astrologo.pdf
  //
  // The filename is the only identifier the platform exposes for a document
  // and it is unique, so the whole value becomes the unitid rather than any
  // part of it. Filenames come in several families: a dominant
  // <issue>-<year>-<surname> form, one carrying an article number, demo
  // copies, one issue that put the title first and the issue and year last,
  // free-form newsletters and papers, and theses.
  if (/^\/InviaDocumentoProtetto\.asp$/i.test(path) && param.NomeFile) {
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = param.NomeFile;

    if ((match = ISSUE_YEAR.exec(param.NomeFile)) !== null) {
      result.issue            = match[1];
      result.publication_date = match[2];
    }

  // Article landing page, carrying the title, the author and an abstract, with
  // the remainder behind the subscription.
  // /Pagine/Pagina.asp?Id=1266
  //
  // This is the investigation to the PDF fetch above being the request. The Id
  // does not appear in the document filename and nothing in either URL links
  // them, so an abstract view and a full-text request for the same article
  // cannot be joined.
  } else if (/^\/Pagine\/Pagina\.asp$/i.test(path) && param.Id) {
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = param.Id;

  // Search, backed by Google Custom Search.
  // /Ricerca.asp?q=confisca&sa=ricerca&cx=...&cof=FORID:11
  //
  // The query is deliberately not recorded. sa, cx and cof identify the search
  // box rather than the search, and carry nothing worth keeping.
  } else if (/^\/Ricerca\.asp$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
