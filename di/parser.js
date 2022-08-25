#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Delphes Indexpresse0
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

  if ((match = /^\/wp-content\/uploads\/[0-9]+\/[0-9]+\/((.+?)_.+)\.pdf$/i.exec(path)) !== null) {
    // wp-content/uploads/2014/01/Delphes2014_Liste_the%CC%81matique.pdf
    result.rtype    = 'LISTE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if (/^\/resultat.asp$/i.test(path)) {
    // http://www.delphes-indexpresse.com/resultat.asp?connecteur=y&BI=1157678
    result.rtype = 'RECORD_VIEW';
    result.mime  = 'HTML';

    if (param.BI) {
      result.title_id = param.BI;
      result.unitid   = param.BI;
    }
  }

  return result;
});

