#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bellefaye
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if (/^\/[a-z]{2}\/(search|result)$/i.test(path)) {
    // https://www.bellefaye.com:443/fr/search
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/[a-z]{2}\/person\/((person|company)\/[0-9]+)$/i.exec(path)) !== null) {
    // https://www.bellefaye.com:443/fr/person/person/43612
    result.rtype  = 'RESULT_CLICK';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/uploads\/media\/[a-z0-9]\/[a-z0-9]\/([a-z0-9_-]+)\.jpg$/i.exec(path)) !== null) {
    // https://www.bellefaye.com:443/uploads/media/5/e/5e4b9ef1089b9.jpg
    result.rtype  = 'IMAGE';
    result.mime   = 'JPEG';
    result.unitid = match[1];

  }

  return result;
});
