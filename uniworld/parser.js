#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform UniWorld
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/user\/([0-9]+)\/subscription\/([a-z]+)\/([0-9]+)$/i.test(path)) || (/^\/historical-data$/i.test(path))) {
    // https://uniworldonline.com:443/user/2036/subscription/pdf/29702
    // https://uniworldonline.com:443/user/2036/subscription/print/29702
    // https://uniworldonline.com:443/user/2036/subscription/excel/29702
    // https://uniworldonline.com:443/historical-data
    // https://uniworldonline.com:443/historical-data?field_archive_date_value%5Bvalue%5D%5Byear%5D=2017
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/historical-data\/([a-sA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://uniworldonline.com:443/historical-data/june-2019-american-companies-global-operations
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/sites\/default\/files\/([a-sA-Z0-9,.%-]+)$/i.exec(path)) !== null) {
    // https://uniworldonline.com:443/sites/default/files/June%2C%202019%20American%20Companies%20with%20Global%20Operations.xlsx
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];

  }

  return result;
});
