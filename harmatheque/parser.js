#!/usr/bin/env node

// ##EZPAARSE
// very simple skeleton parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};

  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/playebook\/(.+)$/.exec(path)) !== null) {
    // https://www.harmatheque.com/playebook/le-hitopadesha-recueil-de-contes-de-l-inde-ancienne

    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});

