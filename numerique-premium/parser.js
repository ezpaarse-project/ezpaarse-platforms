#!/usr/bin/env node

// ##EZPAARSE


'use strict';
var Parser = require('../.lib/parser.js');


module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;


  var match;

  if ((match = /^\/content\/([a-z]+)\/([0-9]+)$/.exec(path)) !== null) {
    // http://www.numeriquepremium.com/content/books/9782728801749
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1] +'/'+match[2];
    result.unitid   = match[2];
  } 

  return result;
});

