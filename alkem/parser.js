#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform ALKEM Digital Library
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

  if (/^\/index\.php$/i.test(path) && param.view) {
    // http://tpsg.alkemlibrary.com/index.php?option=com_content&id=11&view=article&catid=14#modal_63344d614850c8549
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';

  } else if ((match = /^\/alkemdocs\/(.+)\.pdf$/i.exec(path)) !== null) {
    // http://tpsg.alkemlibrary.com/alkemdocs/How%20to%20read%20eBook%20online.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if (/^\/index\.php$/i.test(path) && param.searchword) {
    // http://tpsg.alkemlibrary.com/index.php?searchword=market&searchphrase=all&option=com_search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
