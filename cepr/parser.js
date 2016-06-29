#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Center for economic policy research
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/active\/([a-z]+)\/([a-z\_]+)\/(([a-z\_]*)\.php)$/.exec(path)) !== null) {
    // /active/publications/discussion_papers/dp.php?dpno=10922
    //http://cepr.org/active/publications/discussion_papers/view_pdf.php?dpno=10922
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    if (param.dpno) {
      result.unitid   = param.dpno;
    } else if (param.pino) {
      result.unitid   = param.pino;
    }
    var testpdf = match[4].split('_')[1];
    if (testpdf == 'pdf') {
      result.rtype    = 'WORKING_PAPER';
      result.mime     = 'PDF';
    }
  } else if ((match = /^\/content\/([a-z\-]+)$/.exec(path)) !== null) {
    //http://cepr.org/content/discussion-papers
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/sites\/([a-z]+)\/([a-z]+)\/([a-z\_]+)\/([A-Za-z]+)([0-9]+).pdf$/.exec(path)) !== null) {
    //sites/default/files/policy_insights/PolicyInsight83.pdf
    result.rtype    = 'WORKING_PAPER';
    result.mime     = 'PDF';
    result.unitid   = match[5];
  }

  return result;
});

