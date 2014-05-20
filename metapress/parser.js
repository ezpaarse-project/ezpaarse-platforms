#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var match;

  // http://iospress.metapress.com/content/977v06v38w552j8r/fulltext.html
  // http://iospress.metapress.com/content/977v06v38w552j8r/fulltext.pdf
  if ((match = /^\/content\/([a-z0-9]+)\/fulltext\.(html|pdf)\/?$/i.exec(path)) !== null) {
    result.title_id = match[1];
    result.unitid   = match[1];
    result.mime     = match[2].toUpperCase();
    result.rtype    = 'ARTICLE';

  // http://iospress.metapress.com/content/103143
  // http://iospress.metapress.com/content/m24924142248/?p=a1cde377bd124a8894d178f0966e27ca&pi=3
  } else if ((match = /^\/content\/([a-z0-9]+)\/?$/i.exec(path)) !== null) {
    result.title_id   = match[1];
    result.mime  = 'HTML';
    result.rtype = 'TOC';

  // http://iospress.metapress.com/content/1875-8584
  } else if ((match = /^\/content\/([0-9]{4}-[0-9]{4})\/?$/i.exec(path)) !== null) {
    result.print_identifier  = match[1]; // can be both print and electronic
    result.online_identifier = match[1];
    result.mime              = 'HTML';
    result.rtype             = 'TOC';
  }
  return result;
});
