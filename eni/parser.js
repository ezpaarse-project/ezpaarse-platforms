#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bibliothèque Numérique ENI
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

  if ((match = /^\/([a-z_]+)\/([a-z_]+).aspx$/i.exec(path)) !== null) {
    //client_net/mediabook.aspx?idR=162245
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'HTML';

    if (param.idR || param.idr) {
      result.unitid = param.idR || param.idr;
    } else if (param.idp) {
      result.unitid = param.idp;
    } else if (param.ext === 'webm') {
      result.rtype  = 'VIDEO';
      result.mime   = 'MISC';
      result.unitid = param.idM;
    } else if (/pdf/.test(match[2])) {
      result.mime = 'PDF';
    }

    if (match[2] === 'video') {
      result.rtype = 'TOC';
      result.mime  = 'MISC';
    }
  }
  return result;
});

