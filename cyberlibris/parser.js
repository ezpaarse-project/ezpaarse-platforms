#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Cyberlibris
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

  if ((match = /^\/book\/([0-9]+)$/.exec(path)) !== null) {
    // http://univ-paris1.cyberlibris.com/book/88826141
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/catalog\/book\/docid\/([0-9]+).*$/.exec(path)) !== null) {
    // http://univ-paris1.cyberlibris.com/catalog/book/docid/88805591/searchstring/femmes
    // http://univ-paris1.cyberlibris.com/catalog/book/docid/88805591
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/reader(?:\/istream)?\/docid\/(([0-9]+)(?:\/page\/[0-9]+)?)$/.exec(path)) !== null) {
    // feuilletage en ligne HTML5
    // http://univ-paris1.cyberlibris.com/reader/istream/docid/88826141/page/1
    // http://www.scholarvox.com/reader/docid/88855042
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/api\/js\/book\/.+\/page\/[0-9]+$/.exec(path)) !== null) {
    // /api/js/book/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiO/page/4
    result.rtype    = 'BOOK_PAGE';
    result.mime     = 'HTML';

  } else if ((match = /^\/reader\/flashpagesrv\/$/.exec(path)) !== null) {
    // feuilletage en ligne, version flash reader (traffic firebug)
    // http://univ-rennes1.cyberlibris.fr:80/reader/flashpagesrv/?docid=88814647&p=20&sig=001b540391345e4b79812e5285313c0a83a96dc9
    result.rtype    = 'BOOK';
    result.mime     = 'FLASH';
    result.title_id = param.docid;
    result.unitid   = `${param.docid}/page/${param.p}`;
  }

  return result;
});

