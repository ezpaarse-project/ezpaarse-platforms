#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform siam
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

  if ((match = /^\/action\/doSearch/i.exec(path)) !== null) {
    // http://epubs.siam.org.insmi.bib.cnrs.fr/action/doSearch?publication=40000033
    // http://epubs.siam.org.insmi.bib.cnrs.fr/action/doSearch?publication=40000033&startPage=&Year=2013
    result.rtype = 'TOC';
    result.mime  = 'MISC';

    if (param.Year) {
      result.publication_date = param.Year;
    }
    if (param.publication) {
      result.title_id = param.publication;
    }
  } else if ((match = /^\/doi\/([a-z]+)\/(([0-9.]+)\/([0-9a-z]+))/i.exec(path)) !== null) {
    // http://epubs.siam.org.insmi.bib.cnrs.fr/doi/pdf/10.1137/100811970
    // http://epubs.siam.org.insmi.bib.cnrs.fr/doi/ref/10.1137/100811970
    // http://epubs.siam.org.insmi.bib.cnrs.fr/doi/abs/10.1137/100811970
    // http://epubs.siam.org.insis.bib.cnrs.fr/doi/abs/10.1137/15M1013857
    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime = 'HTML';
      break;
    case 'ref':
      result.rtype = 'REF';
      result.mime = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    }

    result.unitid = match[4];
    result.doi = match[2];
  }

  return result;
});
