#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

/**
  if ((match = /^\/(search)/.exec(path)) !== null) {
    // http://lara.inist.fr/search?query=transport&submit=OK
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/(community-list)/.exec(path)) !== null) {
    // http://lara.inist.fr/community-list
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/(advanced-search)/.exec(path)) !== null) {
    // http://lara.inist.fr/advanced-search
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/(handle)\/([0-9]+\/[0-9]+)/.exec(path)) !== null) {
    // http://lara.inist.fr/handle/2332/455
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.title_id = match[2];
**/
  if ((match = /^\/(bitstream\/handle)\/([0-9]+\/[0-9]+)\/(.*\.pdf)$/.exec(path)) !== null) {
    // http://lara.inist.fr/bitstream/handle/2332/1262/INIST_Indicateurs2002.pdf?sequence=1
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[2];
    result.unitid = match[3];
  } else if ((match = /^\/(bitstream\/handle)\/([0-9]+\/[0-9]+)\/(.*\.html?)$/.exec(path)) !== null) {
    // http://lara.inist.fr/bitstream/handle/2332/1426/Godard_Bellec_AX_VI_ATSDR_Public_Health_
    // Statements_Mirex_and_Chlordecone.htm?sequence=9
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[2];
    result.unitid = match[3];
  }
  return result;
});

