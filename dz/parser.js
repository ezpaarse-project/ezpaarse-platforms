#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DigiZeitschriften
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


  if (/^\/dms\/resolveppn\/?$/i.test(path)) {
    // /dms/resolveppn/?PID=urn:nbn:de:bsz:16-diglit-64819%7Clog00005
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = param.PID;

  } else if ((match = /^\/download\/[a-z0-9:_-]+\/([a-z0-9:_-]+)\.pdf$/i.exec(path)) !== null) {
    // /download/PPN235181684_0306/PPN235181684_0306___log8.pdf
    // /download/urn:nbn:de:bsz:16-diglit-79103/urn:nbn:de:bsz:16-diglit-79103___log00011.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];
  }

  return result;
});
