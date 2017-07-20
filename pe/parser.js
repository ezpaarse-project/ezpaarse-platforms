#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform peuclid
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let hash   = parsedUrl.hash;
  let match;

  if ((match = /^\/download\/(pdf|pdfview)_[0-9]+\/([a-z.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://projecteuclid.org.insis.bib.cnrs.fr/download/pdfview_1/euclid.ndjfl/1427202973
    // http://projecteuclid.org.insis.bib.cnrs.fr/download/pdf_1/euclid.ndjfl/1427202973
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[3];
    result.title_id = match[2];

  } else if ((match = /^\/current\/([a-z.]+)$/i.exec(path)) !== null) {
    // http://projecteuclid.org.insis.bib.cnrs.fr/current/euclid.ndjfl
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];

  } else if ((match = /^\/([a-z.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // http://projecteuclid.org.insis.bib.cnrs.fr/euclid.ndjfl/1452520241
    result.title_id = match[1];
    result.unitid   = match[2];

    if (hash) {
      result.rtype = 'TOC';
      result.mime  = 'MISC';
    } else {
      result.rtype = 'ABS';
      result.mime  = 'HTML';
    }
  }

  return result;
});
