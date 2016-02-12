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

  if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] + match[3];
  } else if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3/035002
    result.rtype    = 'ABS';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1] + match[3];
  } else if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+\/[0-9]+\/article)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3/035002/article
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1] + match[3];
  } else if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)\/[0-9]+\/[0-9]+\/[0-9]+\/pdf\/([^.]+\.pdf)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3/035002/pdf/1758-5090_5_3_035002.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[3];
  } else if ((match = /\/article\/([0-9]{2}\.[0-9]{4,5})\/(([0-9]{4}\-[0-9]{4})\/([0-9]+)\/([0-9]+)\/[A-Z0-9]+)\/([a-z]+)$/.exec(path)) !== null) {
    // article/10.1088/1748-0221/6/12/C12060/meta
    result.rtype = 'ABS';
    result.mime  = 'MISC';
    if (match[6] === 'pdf'){
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
    }
    result.print_identifier = match[3];
    result.vol    = match[4];
    result.issue  = match[5];
    result.doi    = match[1] + "/" + match[2];
    result.unitid = match[2];
  }

  return result;
});
