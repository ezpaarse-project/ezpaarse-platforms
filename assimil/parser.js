#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result   = {};
  var pathname = parsedUrl.pathname; /* The path section of the URL, that comes after the host and before the query, including the initial slash if present. Example: '/p/a/t/h' */

  var match;



  if ((match = /^\/assimilweb\/methode\/(\d{4})\/ANMacPCWeb\.html$/.exec(pathname)) !== null) {
    //	http://biblio.assimil.com:80/assimilweb/methode/3903/ANMacPCWeb.html

    result.unitid = match[1];
    result.title_id= match[1];
    result.rtype  = 'BOOK';
    result.mime   = 'MISC';
  }

  return result;
});
