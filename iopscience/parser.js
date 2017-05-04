#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  var hash   = parsedUrl.hash || {};
  var match;

  if ((match = /^\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // /1758-5090/5/3
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] + match[3];
  } else if ((match = /^\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+\/[0-9]+)$/i.exec(path)) !== null) {
    // /1758-5090/5/3/035002
    result.rtype    = 'ABS';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] + match[3];
  } else if ((match = /^\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+\/[0-9]+\/article)$/i.exec(path)) !== null) {
    // /1758-5090/5/3/035002/article
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1] + match[3];
  } else if ((match = /^\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)\/[0-9]+\/[0-9]+\/[0-9]+\/pdf\/([^.]+\.pdf)$/i.exec(path)) !== null) {
    // /1758-5090/5/3/035002/pdf/1758-5090_5_3_035002.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[3];

  } else if ((match = /^\/article\/(10\.[0-9]+\/(([0-9]{4}\-[0-9]{3}[0-9x])\/([0-9]+)\/([0-9]+)\/[a-z0-9]*))(\/[a-z]+)?/i.exec(path)) !== null) {
    // /article/10.1088/1748-0221/6/12/C12060/meta
    // /article/10.3847/0004-637X/819/2/158/pdf
    // /article/10.3847/0004-637X/820/1/4
    result.rtype            = hash === '#artAbst' ? 'ABS': 'ARTICLE';
    result.mime             = match[6] === '/pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.print_identifier = match[3];
    result.vol              = match[4];
    result.issue            = match[5];
  } else if ((match = /^\/article\/(10\.[0-9]+\/(([0-9]{4}\-[0-9]{3}[0-9x])\/[a-z0-9]+))\/(pdf|meta)/i.exec(path)) !== null) {
    // /article/10.1088/2040-8986/aa6097/pdf
    result.rtype            = 'ARTICLE';
    result.mime             = match[4] === 'pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.print_identifier = match[3];

  } else if ((match = /^\/article\/(10\.[0-9]+\/([a-z]+([0-9]{4})v0*([0-9]+)n0*([0-9]+)[a-z0-9]+))\/(pdf|meta)$/i.exec(path)) !== null) {
    // /article/10.1070/SM1967v001n04ABEH001994/pdf
    result.rtype            = 'ARTICLE';
    result.mime             = match[6] === 'pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.publication_date = match[3];
    result.vol              = match[4];
    result.issue            = match[5];

  } else if ((match = /^\/issue\/([0-9]{4}\-[0-9A-Z]*)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // /issue/0004-637X/831/2
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = match[2] + '/' + match[3];
    result.print_identifier = match[1];
    result.vol    = match[2];
    result.issue  = match[3];
  }

  return result;
});
