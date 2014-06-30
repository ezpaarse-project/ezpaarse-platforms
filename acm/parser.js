#!/usr/bin/env node

// ##EZPAARSE
// ACM parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/([0-9\.]+)\/([0-9]+)\/([0-9]+)\/[a-z0-9\-]+\.pdf$/.exec(path)) !== null) {
    // http://delivery.acm.org/10.1145/2560000/2556270/a3-shi.pdf?ip=193.54.110.38&id=2556270&acc=ACTIVE%20SERVICE&key=7EBF6E77E86B478F%2EEFE870C1C9C19B7C%2E4D4702B0C3E38B35%2E4D4702B0C3E38B35&CFID=472596828&CFTOKEN=53172297&__acm__=1402048066_62d2ddb9fd0df357f3d5bff22afa76e0
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = match[1] + '/' + match[3];
    result.unitid   = result.doi;
  }

  return result;
});

