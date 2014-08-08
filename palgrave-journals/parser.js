#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Palgrave Journals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/([a-z]+)\/journal\/v[0-9]+\/n[0-9]+\/([a-z]+)\/?([a-z0-9]+)?/.exec(path)) !== null) {
    // http://www.palgrave-journals.com/ap/journal/v49/n2/index.html
    // http://www.palgrave-journals.com/ap/journal/v49/n2/abs/ap20139a.html
    // http://www.palgrave-journals.com/ap/journal/v49/n2/full/ap20139a.html
    // http://www.palgrave-journals.com/ap/journal/v49/n2/pdf/ap20139a.pdf

    result.title_id = match[1];
    result.unitid   = match[1] + (match[3] || match[2]);

    switch (match[2]) {
    case 'index':
      result.rtype = 'TOC';
      result.mime  = 'HTML';
      break;
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    }
  }

  return result;
});

