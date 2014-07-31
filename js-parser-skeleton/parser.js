#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * [description-goes-here]
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/platform\/path\/to\/(document\-([0-9]+)\-test\.pdf)$/.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    result.rtype = 'ARTICLE';
    result.mime  = 'PDF';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/platform\/path\/to\/(document\-([0-9]+)\-test\.html)$/.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
  }

  return result;
});

