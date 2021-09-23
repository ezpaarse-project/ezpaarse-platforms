#!/usr/bin/env node

/**
 * parser for proquest platform
 * in beta tries to keep the databases in 'title_id' when possible
 * impossible when multiple databases are selected
 */
'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Proquest
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/media\/pq\/classic\/doc\/(\d+)\/fmt\/ai\/rep\/[SN]PDF/i.exec(path)) !== null) {
    // /media/pq/classic/doc/3248224701/fmt/ai/rep/NPDF
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^(?:\/(\w+))?\/docview\/(\d+)\/(fulltextPDF|fulltext|previewPDF|abstract)/i.exec(path)) !== null) {
    // /adac/docview/1548422574/fulltext
    // /asfa/docview/304898618/previewPDF/C3CDCDB5CD9248A8PQ/1
    // /asfa/docview/869568616/abstract/C3CDCDB5CD9248A8PQ/1
    // /asfa/docview/304898618/fulltextPDF/C3CDCDB5CD9248A8PQ/1
    // /docview/250996884/fulltextPDF/5CE81019F33B4E76PQ/1

    result.title_id = match[1];
    result.unitid   = match[2];

    switch (match[3].toLowerCase()) {
    case 'fulltextpdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'fulltext':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'previewpdf':
      result.rtype = 'PREVIEW';
      result.mime  = 'PDF';
      break;
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    }

  } else if ((match = /^(?:\/(\w+))?\/docview\/(\d+)\/.{18}/i.exec(path)) !== null) {
    // /asfa/docview/869568616/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^(?:\/(\w+))?\/citedreferences\/MSTAR_(\d+)\//i.exec(path)) !== null) {
    // /asfa/citedreferences/MSTAR_304898618/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^(?:\/(\w+))?\/results\//i.exec(path)) !== null) {
    // /pqdtglobal/results/1B24F6A480174E80PQ/1'
    // /results/5CE81019F33B4E76PQ/1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else if ((match = /^\/lib\/.+\/(search|detail|reader|advancedSearch)\.action/i.exec(path)) !== null) {
    // /lib/sciencespo-grenoble/search.action?op=advance&query=cyberpolitics
    // /lib/sciencespo-grenoble/detail.action?docID=3339542&query=cyberpolitics#goto_toc
    // /lib/sciencespo-grenoble/reader.action?docID=3339542&query=cyberpolitics

    result.mime = 'HTML';
    result.title_id = 'ebookcentral';

    switch (match[1].toLowerCase()) {
    case 'search':
    case 'advancedsearch':
      result.rtype = 'SEARCH';
      break;
    case 'detail':
      result.rtype  = 'TOC';
      result.unitid = parsedUrl.query.docID;
      break;
    case 'reader':
      result.rtype  = 'BOOK';
      result.unitid = parsedUrl.query.docID;
      break;
    }
  }

  return result;
});
