#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ZentralBlatt
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

  if ((match = /^\/pdf\/([0-9.]+)\.pdf$/.exec(path)) !== null) {
    // https://zbmath.org/pdf/06497268.pdf
    result.rtype  = 'REF';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/xml\/([0-9.]+)\.xml$/.exec(path)) !== null) {
    // https://zbmath.org/xml/06497268.xml
    result.rtype  = 'REF';
    result.mime   = 'XML';
    result.unitid = match[1];

  } else if ((match = /^\/bibtex\/([0-9.]+)\.bib$/.exec(path)) !== null) {
    // https://zbmath.org/bibtex/06497268.bib
    result.rtype  = 'REF';
    result.mime   = 'BIBTEX';
    result.unitid = match[1];

  } else if (/^\/(authors|journals|classification)\/?$/.test(path)) {
    // https://zbmath.org/authors/?...
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
    result.unitid = '0';

  } else if (param && param.q) {
    // https://zbmath.org/?q=an:06210326
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = param.q;
  }

  return result;
});

