#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Hoosier State Chronicles
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

  if (/^\/$/i.test(path) && param.txq) {
    // https://newspapers.library.in.gov/?a=q&hs=1&r=1&results=1&txq=Sherman&dafdq=&dafmq=&dafyq=&datdq=&datmq=&datyq=&puq=&txf=txIN&ssnip=txt&e=-------en-20--1--txt-txIN-------
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/cgi-bin\/imageserver.pl$/i.exec(path)) !== null) {
    // https://newspapers.library.in.gov/cgi-bin/imageserver.pl?oid=GB18800610-01&getpdf=true
    result.rtype    = 'ISSUE';
    result.mime     = 'PDF';
    result.unitid   = param.oid;
  } else if (/^\/$/i.test(path) && param.a == 'd') {
    // https://newspapers.library.in.gov/?a=d&d=GB18800610-01.1.7&srpos=4&e=-------en-20--1--txt-txIN-Sherman------
    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
    result.unitid   = param.d;
  } else if (/^\/$/i.test(path) && param.a == 'cl') {
    // https://newspapers.library.in.gov/?a=cl&cl=CL1&sp=GB&e=-------en-20--1--txt-txIN-Sherman------
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }

  return result;
});
