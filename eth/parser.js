#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Obeikan Digital Library
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

if ((match = /^\/cgi-bin\/koha\/opac-detail\.pl$/i.exec(path)) !== null) {
    // http://ethraadl.com/cgi-bin/koha/opac-detail.pl?biblionumber=153
 if (param && param.biblionumber){
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = param.biblionumber;
  }
    
  } else if ((match = /^\/upload(.+)*\/((.+)\.pdf)$/i.exec(path)) !== null) {
    //http://ethraadl.com:809/upload/153-7.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[3];
    
  } else if ((match = /^\/vbbz\.php$/i.exec(path)) !== null) {
    //http://vew.ethraadl.com/vbbz.php?link=aHR0cDovL2V0aHJhYWRsLmNvbTo4MDkvdXBsb2FkLzMwMy5wZGY=
   if (param && param.link){
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = param.link;
    }
  }

  return result;
});
