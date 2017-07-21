#!/usr/bin/env node

/**
 * parser for American Institute of Physics
 * http://analogist.couperin.org/platforms/american-institute-of-physics/
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/docserver\/(?:[^/]+\/)?fulltext\/[a-z]+\/journal\/([a-z0-9]+)\/[0-9]+\/[0-9]+\/([0-9.]+\.(pdf|html))$/i.exec(path)) !== null) {
    // http://scitation.aip.org/docserver/fulltext/aip/journal/chaos/21/4/1.3665984.pdf
    // http://scitation.aip.org/docserver/ahah/fulltext/aip/journal/chaos/24/2/1.4875040.html
    result.title_id = match[1];
    result.unitid   = match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = match[3].toUpperCase();

  } else if ((match = /^\/content\/[a-z]+\/journal\/(([a-z0-9]+)\/[0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // http://scitation.aip.org/content/aip/journal/chaos/21/4
    result.title_id = match[2];
    result.unitid   = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/content\/[a-z]+\/journal\/([a-z0-9]+)\/browse$/i.exec(path)) !== null) {
    // http://scitation.aip.org/content/aip/journal/chaos/browse
    result.title_id = match[1];
    result.unitid   = result.title_id;
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/toc\/apc\/(([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // http://aip.scitation.org/toc/apc/1827/1?expanded=1827
    result.title_id = 'apc';
    result.unitid   = match[1];
    result.vol      = match[2];
    result.issue    = match[3];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/doi\/abs\/(10\.[0-9]+\/([0-9.]+))$/i.exec(path)) !== null) {
    // http://aip.scitation.org/doi/abs/10.1063/1.4979417
    result.unitid = match[2];
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.doi    = match[1];

  } else if ((match = /^\/doi\/pdf\/(10\.[0-9]+\/([0-9.]+))$/i.exec(path)) !== null) {
    // http://aip.scitation.org/doi/pdf/10.1063/1.4979418
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.doi    = match[1];
  }

  return result;
});
