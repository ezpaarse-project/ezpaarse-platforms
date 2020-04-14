#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform http://ang.couperin.org/platforms/to_be_completed/
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // let match;

  if ((/^\/GetBooks.action$/i.test(path)) || (/^\/SearchBooks.action$/i.test(path))) {
    // http://www.chinamaxx.net:80/GetBooks.action?isshowall=off&classNumber=0G
    // http://www.chinamaxx.net:80/SearchBooks.action
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/goPngRead.jsp$/i.test(path)) {
    // http://www.chinamaxx.net:80/goPngRead.jsp?d=8EA41D886B7150931D74A51D840CD7C5&ssid=10005014&pagetype=1&sp=1&ep=-1
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = param.ssid;

  }

  return result;
});
