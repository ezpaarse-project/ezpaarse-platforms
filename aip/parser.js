#!/usr/bin/env node

/**
 * parser for American Institute of Physics
 * http://analyses.ezpaarse.org/platforms/american-institute-of-physics/
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/docserver\/(?:[^/]+\/)?fulltext\/[a-z]+\/journal\/([a-z0-9]+)\/[0-9]+\/[0-9]+\/([0-9.]+\.(pdf|html))$/i.exec(path)) !== null) {
    // /docserver/fulltext/aip/journal/chaos/21/4/1.3665984.pdf
    // /docserver/ahah/fulltext/aip/journal/chaos/24/2/1.4875040.html
    result.title_id = match[1];
    result.unitid   = match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = match[3].toUpperCase();

  } else if ((match = /^\/content\/[a-z]+\/journal\/(([a-z0-9]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /content/aip/journal/chaos/21/4
    result.title_id = match[2];
    result.unitid   = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.vol = match[3];
    result.issue = match[4];

  } else if ((match = /^\/content\/[a-z]+\/journal\/([a-z0-9]+)\/browse$/i.exec(path)) !== null) {
    // /content/aip/journal/chaos/browse
    result.title_id = match[1];
    result.unitid   = result.title_id;
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/toc\/apc\/(([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /toc/apc/1827/1?expanded=1827
    result.title_id = 'apc';
    result.unitid   = match[1];
    result.vol      = match[2];
    result.issue    = match[3];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/doi(\/[a-z]+)?\/(10\.[0-9]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // /doi/abs/10.1063/1.4979417
    // /doi/pdf/10.1063/1.4979418
    // /doi/10.1063/1.5049598
    // /doi/pdf/10.1063/PT.3.4090
    result.doi    = match[2];
    result.unitid = match[3];

    switch (match[1]) {
    case '/epdf':
    case '/pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case '/abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case '/full':
    case undefined:
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    }

  } else if ((match = /^\/aip\/([a-z]+)\/article-pdf\/doi\/(10\.[0-9]+\/([a-z0-9.]+))\/[0-9]+\/[0-9._]+\.pdf$/i.exec(path)) !== null) {
    // https://pubs.aip.org/aip/acp/article-pdf/doi/10.1063/5.0164351/18116273/020004_1_5.0164351.pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[1];
    result.doi = match[2];
    result.unitid = match[3];
  } else if ((match = /^\/aip\/([a-z]+)\/article-pdf\/[0-9]+\/([0-9._]+)\.pdf$/i.exec(path)) !== null) {
    // https://pubs.aip.org/aip/acp/article-pdf/18146317/020023_1_5.0167690.pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/aip\/([a-z]+)\/article\/([0-9]+)\/([0-9]+)\/[0-9]+\/([0-9]+)\/[a-z-]+$/i.exec(path)) !== null) {
    //https://pubs.aip.org/aip/acp/article/2872/1/120047/2913626/Brain-activity-vs-seismicity-Scaling-and-memory?searchresult=1
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.vol  = match[2];
    result.issue = match[3];
    result.unitid = match[4];
  } else if ((match = /^\/aip\/([a-z]+)\/article-abstract\/([0-9]+)\/([0-9]+)\/[0-9]+\/([0-9]+)\/[a-z-]+$/i.exec(path)) !== null) {
    //https://pubs.aip.org/aip/acp/article-abstract/2845/1/050013/2911196/Brain-cancer-detection-in-the-MRI-using-the?redirectedFrom=fulltext
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];
  } else if ((match = /^\/docserver\/fulltext\/[a-z]+\/journal\/([a-z0-9]+)\/[0-9]+\/[0-9]+\/([0-9a-z.]+\.gif)$/i.exec(path)) !== null) {
    //http://scitation.aip.org/docserver/fulltext/aip/journal/chaos/21/4/1.3665984.online.f1.gif
    result.title_id = match[1];
    result.unitid   = match[2];
    result.rtype    = 'IMAGE';
    result.mime     = 'GIF';
  } else if (/^\/search-results$/i.test(path)) {
    //https://pubs.aip.org/search-results?page=1&q=rocks
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }
  return result;
});
