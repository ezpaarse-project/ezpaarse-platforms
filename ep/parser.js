#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Embo Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/doi\/(pdf|full|epdf)\/(10\.[0-9]{4,})\/([a-z0-9.]+)$/i.exec(path)) !== null) {
    // /doi/pdf/10.15252/embj.2019102497
    // /doi/full/10.15252/embj.2018100801

    result.rtype    = 'ARTICLE';
    switch (match[1]) {
    case 'full':
      result.mime = 'HTML';
      break;

    case 'pdf':
    case 'epdf':
      result.mime = 'PDF';
      break;
    }
    result.doi      = `${match[2]}/${match[3]}`;
    result.unitid   = match[3];
  }

  return result;
});
