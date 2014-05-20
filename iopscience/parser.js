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
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.title_id = match[1];
    result.unitid = match[1] + match[3];
  } else if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+\/[0-9]+)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3/035002
    result.rtype = 'ABS';
    result.mime  = 'MISC';
    result.title_id = match[1];
    result.unitid = match[1] + match[3];
  } else if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)(\/[0-9]+\/[0-9]+\/[0-9]+\/article)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3/035002/article
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.unitid = match[1] + match[3];
  } else if ((match = /\/([0-9]{4}\-[0-9]{3}([0-9Xx])?)\/[0-9]+\/[0-9]+\/[0-9]+\/pdf\/([^.]+\.pdf)$/.exec(path)) !== null) {
    // http://iopscience.iop.org/1758-5090/5/3/035002/pdf/1758-5090_5_3_035002.pdf
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[1];
    result.unitid = match[3];
  }
  return result;
});
