#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Center for economic policy research
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/active\/[a-z]+\/[a-z_]+\/[a-z_]+?(_pdf)?\.php$/i.exec(path)) !== null) {
    // /active/publications/discussion_papers/dp.php?dpno=10922
    // /active/publications/discussion_papers/view_pdf.php?dpno=10922
    result.rtype = 'ABS';
    result.mime  = 'HTML';

    if (param.dpno) {
      result.unitid = param.dpno;
    } else if (param.pino) {
      result.unitid = param.pino;
    }

    if (match[1]) {
      result.rtype = 'WORKING_PAPER';
      result.mime  = 'PDF';
    }
  } else if (/^\/content\/([a-z-]+)$/i.test(path)) {
    // /content/discussion-papers
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if ((match = /^\/sites\/[a-z]+\/[a-z]+\/[a-z_]+\/[a-z]+([0-9]+).pdf$/i.exec(path)) !== null) {
    // /sites/default/files/policy_insights/PolicyInsight83.pdf
    result.rtype  = 'WORKING_PAPER';
    result.mime   = 'PDF';
    result.unitid = match[1];
  }

  return result;
});

