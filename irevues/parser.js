#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

/**
  if ((match = /^\/(search)/.exec(path)) !== null) {
    // 
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/(community-list)/.exec(path)) !== null) {
    // 
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/(advanced-search)/.exec(path)) !== null) {
    // 
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[1];
 **/
 if ((match = /^\/(handle)\/([0-9]+)\/([0-9]+)/.exec(path)) !== null) {
    // http://documents.irevues.inist.fr/handle/2042/38749
    result.rtype = 'MISC';
    result.mime  = 'HTML';
    result.title_id = match[3];
  } else if ((match = /^\/(bitstream\/handle)\/([0-9]+)\/([0-9]+)\/(.*\.pdf)$/.exec(path)) !== null) {
    // http://documents.irevues.inist.fr/bitstream/handle/2042/39472/FM%20XXIV-2%20148-158.pdf?sequence=1
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[3];
    result.unitid = match[4];
  } else if ((match = /^\/(bitstream\/handle)\/([0-9]+)\/([0-9]+)\/(.*\.html?)$/.exec(path)) !== null) {
    // 
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[3];
    result.unitid = match[4];
  } else if ((match = /^\/$/.exec(path)) !== null) {
    // http://irevues.inist.fr/?mmddom=off&sousdom=BIOL
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    if (param.sousdom) { result.title_id = param.sousdom; }
  }
  return result;
});