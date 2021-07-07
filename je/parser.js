#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform JurisEdit
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters

  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/membres\/files\/resultats.php$/i.exec(path) !== null) {
    // http://www.jurisedit.com.proxy.bnl.lu/membres/files/resultats.php?base=jurissoc&file=L270516_RCS.htm
    // http://www.jurisedit.com.proxy.bnl.lu/membres/files/resultats.php?base=juriscomintegral&file=20210506-CAS-2020-00080.pdf
    result.rtype    = 'JURISPRUDENCE';

    if ((match = /^([a-z0-9_-]+)\.([a-z]+)$/i.exec(param.file)) !== null) {
      result.unitid = match[1];
      if (match[2] === 'htm') {
        result.mime = 'HTML';
      }
      if (match[2] === 'pdf') {
        result.mime = 'PDF';
      }
    }
  }

  return result;
});
