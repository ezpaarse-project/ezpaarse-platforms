#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for American Institute of Physics
 * http://analogist.couperin.org/platforms/american-institute-of-physics/
 */
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var match;

  if ((match = /\/docserver\/(?:[^\/]+\/)?fulltext\/[a-z]+\/journal\/([a-z0-9]+)\/[0-9]+\/[0-9]+\/([0-9\.]+\.(pdf|html))$/.exec(path)) !== null) {
    // http://scitation.aip.org/docserver/fulltext/aip/journal/chaos/21/4/1.3665984.pdf
    // http://scitation.aip.org/docserver/ahah/fulltext/aip/journal/chaos/24/2/1.4875040.html
    result.title_id = match[1];
    result.unitid   = match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = match[3].toUpperCase();
  } else if ((match = /\/content\/[a-z]+\/journal\/(([a-z0-9]+)\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://scitation.aip.org/content/aip/journal/chaos/21/4
    result.title_id = match[2];
    result.unitid   = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /\/content\/[a-z]+\/journal\/([a-z0-9]+)\/browse$/.exec(path)) !== null) {
    // http://scitation.aip.org/content/aip/journal/chaos/browse
    result.title_id = match[1];
    result.unitid   = result.title_id;
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }
  return result;
});
