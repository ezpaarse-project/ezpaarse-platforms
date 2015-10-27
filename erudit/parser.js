#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result   = {};
  var url      = parsedUrl.href;
  var param    = parsedUrl.query || {};
  var pathname = parsedUrl.pathname || '';

  var match;
  if (param.url) {
    url = param.url;
  }

  if ((match = /\/revue\/([a-zA-Z]+)\/([0-9]{4})\/([^\\]+)\/([^\\]+)\/index.html$/.exec(pathname)) !== null) {
    // http://www.erudit.org.gate3.inist.fr/revue/ac/1974/v7/n1/index.html
    result.rtype = 'TOC';
    result.mime = 'MISC';
    result.title_id = match[1];
    result.unitid= match[1]+ "/" + match[2] +"/" + match[3] +"/" +  match[4];
    result.publication_date = match[2] ;
    result.vol = match[3];
    result.issue = match[4];
  } else if ((match = /\/revue\/([a-zA-Z]+)\/([0-9]{4})\/([^\\]+)\/([^\\]+)\/([a-zA-Z0-9]+).html$/.exec(pathname)) !== null) {
      result.title_id = match[1];
      result.unitid= match[1]+ "/" + match[2] +"/" + match[3] +"/" +  match[4]+"/" +  match[5];
      result.publication_date = match[2] ;
      result.vol = match[3];
      result.issue = match[4];
      result.doi = '10.7202/' + match[5];
    if (param.vue && param.vue === "resume") {
      // http://www.erudit.org.gate3.inist.fr/revue/ac/1974/v7/n1/017030ar.html?vue=resume
      result.rtype = 'ABS';
      result.mime = 'HTML';
    } else if (param.vue && param.vue === "biblio") {
      // http://www.erudit.org.gate3.inist.fr/revue/crimino/2013/v46/n1/1015292ar.html?vue=biblio&mode=restriction
      result.rtype = 'REF';
      result.mime = 'MISC';
    } else {
      // http://www.erudit.org.gate3.inist.fr/revue/ae/2010/v86/n4/1005678ar.html
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
    }
  } else if ((match = /\/revue\/([a-zA-Z]+)\/([0-9]{4})\/([^\\]+)\/([^\\]+)\/([a-zA-Z0-9]+).pdf$/.exec(pathname)) !== null) {
    // http://www.erudit.org.gate3.inist.fr/revue/ae/2009/v85/n4/045072ar.pdf
    result.title_id = match[1];
     result.unitid= match[1]+ "/" + match[2] +"/" + match[3] +"/" +  match[4]+"/" +  match[5];
      result.publication_date = match[2] ;
      result.vol = match[3];
      result.issue = match[4];
      result.doi = '10.7202/' + match[5];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  }
  return result;
});
