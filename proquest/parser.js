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
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  console.error(parsedUrl);

  let match;

  if ((match = /^\/(\w+)\/docview\/(\d+)\/fulltextPDF/i.exec(path)) !== null) {
    // /asfa/docview/304898618/fulltextPDF/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    //result.title_id = match[1];
    result.unitid = match[2];

  }  else if ((match = /^\/docview\/(\d+)\/fulltextPDF/i.exec(path)) !== null) {
    // /docview/250996884/fulltextPDF/5CE81019F33B4E76PQ/1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/media\/pq\/classic\/doc\/(\d+)\/fmt\/ai\/rep\/[SN]PDF/i.exec(path)) !== null) {
    // /media/pq/classic/doc/3248224701/fmt/ai/rep/NPDF
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/(\w+)\/docview\/(\d+)\/fulltext/i.exec(path)) !== null) {
    // /adac/docview/1548422574/fulltext
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/docview\/(\d+)\/fulltext/i.exec(path)) !== null) {
    // 
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/(\w+)\/docview\/(\d+)\/previewPDF/i.exec(path)) !== null) {
    // /asfa/docview/304898618/previewPDF/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'PREVIEW';
    result.mime     = 'PDF';
    //result.title_id = match[1];
    result.unitid = match[2];

  }  else if ((match = /^\/docview\/(\d+)\/previewPDF/i.exec(path)) !== null) {
    // 
    result.rtype    = 'PREVIEW';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/(\w+)\/docview\/(\d+)\/abstract/i.exec(path)) !== null) {
    // /asfa/docview/869568616/abstract/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/docview\/(\d+)\/abstract/i.exec(path)) !== null) {
    // 
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/(\w+)\/docview\/(\d+)\/.{18}/i.exec(path)) !== null) {
    // /asfa/docview/869568616/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/docview\/(\d+)\/.{18}/i.exec(path)) !== null) {
    // 
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/(\w+)\/citedreferences\/MSTAR_(\d+)\//i.exec(path)) !== null) {
    // /asfa/citedreferences/MSTAR_304898618/C3CDCDB5CD9248A8PQ/1
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    //result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/(\w+)\/citedreferences\/MSTAR_(\d+)\//i.exec(path)) !== null) {
    // 
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/(\w+)\/results\//i.exec(path)) !== null) {
    // /pqdtglobal/results/1B24F6A480174E80PQ/1'
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    //result.title_id = match[1];

  } else if ((match = /^\/results\//i.exec(path)) !== null) {
    // /results/5CE81019F33B4E76PQ/1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
