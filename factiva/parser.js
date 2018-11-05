#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Factiva
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

  if (/login.asp$/i.test(path)) {
    // https://global.factiva.com:443/en/sess/login.asp?cookie=on&XSID=S00ZWrr1cbyMTZyMTMvODMtM9MuOXmm5DFHY96oYqZlNFFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB
    result.rtype    = 'CONNECTION';
    result.mime     = 'HTML';
  } else if ((match = /^\/(.*).mp3$/i.exec(path)) !== null) {
    // https://global.factiva.com:443/APNRUW0020181003eea5002ut.mp3?tkn=9lqW0VRwuX1Vy8wElyjuGlQnuO5rd42YIqe8DUknG7ucAXG553GSEh6I2PX_2Fm4YWvkfywGSwJMp5vOyMwklFnkd_2B7dnkjKVzD6fbGhdcubB3qv0WemPaLxIy9M0F9Bz76TIyaKW_2BdoiT73iL3b3V_2F0Xz8lu8o4b9tCXy_2F4Z65tKMBHVCqZl3HT0hg9gkBkmGgStYZk_2F2bUrsbfaz5H3pvO_2FvGVqF8fT3enCbvmynHy0_3D_7C2
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if (/^\/controls\/search\/SearchBuilder/i.test(path)) {
    // https://global.factiva.com:443/controls/search/SearchBuilder0190400ui4sr.ashx
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
