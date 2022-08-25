#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Centre de diffusion de revues Académiques Mathématiques
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

  if ((match = /^\/[a-z]+-bin\/[a-z]+\/(([a-z]+)[0-9_]+).(pdf|tex)$/i.exec(path)) !== null) {
    // http://jep.cedram.org/cedram-bin/article/JEP_2015__2__1_0.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = match[3] === 'tex' ? 'TEX' : 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/[a-z]+-bin\/([a-z]+)$/i.exec(path)) !== null) {
    // http://jep.cedram.org/cgi-bin/feuilleter?id=JEP_2015__2_

    if (match[1] === 'feuilleter') {
      result.rtype = 'TOC';
      result.mime  = 'HTML';
    } else {
      result.rtype = 'RECORD_VIEW';
      result.mime  = 'HTML';
    }

    if (param.id) {
      result.title_id = param.id.split('_')[0];
      result.unitid   = param.id;
    }
  }

  return result;
});

