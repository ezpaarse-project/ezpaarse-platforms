#!/usr/bin/env node

// ##EZPAARSE
// ACM parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};
  var match;

  if ((match = /^\/([0-9\.]+)\/([0-9]+)\/([0-9]+)\/[a-z0-9\-]+\.pdf$/.exec(path)) !== null) {
    // http://delivery.acm.org/10.1145/2560000/2556270/a3-shi.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = match[1] + '/' + match[3];

  } else if ((match = /^\/([0-9]+)\/([0-9]+)\/([a-z]+)\/([a-z0-9]+\.pdf)$/.exec(path)) !== null) {
    // /1120000/1113378/fm/frontmatter.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[3];
    result.unitid      = match[3] + '/' + match[4];

  } else if ((match = /^\/([a-z]+).cfm$/.exec(path)) !== null) {
    // detail.cfm

    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (match[1] === 'citation') {
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    } else if (match[1] == 'event' || match[1] == 'results') {
      result.rtype    = 'TOC';
    }
    if (param.id) {
      result.unitid = param.id;
    }
  }

  return result;
});

