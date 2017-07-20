#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/([0-9.]+)\/([0-9]+)\/([0-9]+)\/[a-z0-9-]+\.pdf$/.exec(path)) !== null) {
    // http://delivery.acm.org/10.1145/2560000/2556270/a3-shi.pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.doi   = match[1] + '/' + match[3];

  } else if ((match = /^\/[0-9]+\/[0-9]+\/(([a-z]+)\/[a-z0-9]+)\.pdf$/.exec(path)) !== null) {
    // /1120000/1113378/fm/frontmatter.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-z]+).cfm$/.exec(path)) !== null) {
    // detail.cfm

    if (param.id) {
      result.unitid = param.id;
    }

    switch (match[1]) {
    case 'detail':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'citation':
      result.rtype = 'TOC';
      result.mime  = 'MISC';
      break;
    case 'event':
    case 'results':
      result.rtype = 'TOC';
      result.mime  = 'HTML';
    }
  } else if ((match = /\/cert*$/.exec(path)) !== null) {
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
  }

  return result;
});

