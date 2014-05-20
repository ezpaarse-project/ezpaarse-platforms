#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
// this parser is adapted from parser of bioone

'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /\/([a-zA-Z]+)$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/dna
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /\/toc\/(([a-zA-Z]+)\/([0-9\.]+)\/([^\/]+))$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/toc/dna/32/1
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.title_id = match[2];
    result.unitid = match[1];
  } else if ((match = /\/doi\/abs\/([0-9\.]+\/([^\/\.]+)\.[^\/]+)$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/abs/10.1089/dna.2012.1776
    result.rtype = 'ABS';
    result.mime  = 'MISC';
    result.title_id = match[2];
    result.unitid = match[1];
  } else if ((match = /\/doi\/full\/(([0-9\.]+)\/(([^\.]+).[^\.]+.[^\.]+))$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/full/10.1089/dna.2012.1776
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[4];
    result.unitid = match[1];
  } else if ((match = /\/doi\/pdf(plus)?\/(([0-9\.]+)\/([^\/\(\.)]+)\.[^\/)]+)$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/pdf/10.1089/dna.2012.1776
    // http://online.liebertpub.com.gate1.inist.fr/doi/pdfplus/10.1089/dna.2012.1776
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[4];
    result.unitid = match[2];
  }
  return result;
});

