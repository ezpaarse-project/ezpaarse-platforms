#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/([0-9.]+)\/([0-9]+)\/([0-9]+)\/[a-z0-9-]+\.pdf$/i.exec(path)) !== null) {
    // http://delivery.acm.org/10.1145/2560000/2556270/a3-shi.pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.doi   = match[1] + '/' + match[3];

  } else if ((match = /^\/[0-9]+\/[0-9]+\/(([a-z]+)\/[a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // /1120000/1113378/fm/frontmatter.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-z]+).cfm$/i.exec(path)) !== null) {
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
  } else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://dl.acm.org/doi/10.1145/3426826.3426837
    result.doi = match[1];
    result.unitid = match[2];
    result.rtype = 'ABS';
    result.mime  = 'HTML';

  } else if ((match = /^\/doi\/(abs|fullHtml|pdf|epdf)\/(10\.[0-9]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://dl.acm.org/doi/fullHtml/10.1145/3426826.3426837
    // https://dl.acm.org/doi/pdf/10.5555/1074100.1074563
    // https://dl.acm.org/doi/epdf/10.5555/1074100.1074563
    result.doi = match[2];
    result.unitid = match[3];

    switch (match[1].toLowerCase()) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'fullhtml':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'epdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  } else if ((match = /^\/action\/doSearch$/i.exec(path)) !== null) {
    // https://dl.acm.org/action/doSearch?AllField=machine+learning
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});

