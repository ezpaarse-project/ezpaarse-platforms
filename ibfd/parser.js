#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform International Bureau of Fiscal Documentation
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/collections\/oecd\/pdf\/([a-z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /collections/oecd/pdf/oecd_pcd_challenges_digitalisation_economy.pdf
    result.rtype = 'OTHER';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if (/^\/#\/doc$/i.test(path)) {
    // /#/doc?url=/collections/kf/html/kf_dz.html
    // /#/doc?url=/collections/bit/html/bit_2021_06_ca_1.html
    result.rtype = 'OTHER';
    result.mime = 'PDF';

    if ((match = /^\/collections\/[a-z]+\/html\/([a-z0-9-_]+)\.html$/i.exec(param.url)) !== null && param.doc) {
      result.unitid = match[1];
    }
  }

  return result;
});
