#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  //Ensuite tu peux accéder à ec qui est un objet javascript. 
  //Donc par exemple ec.size te donnera la taille en octet de la consultation en question
  var result   = {};
  //var domain   = parsedUrl.hostname; /* Just the lowercased hostname portion of the host. Example: 'host.com' */
  var pathname   = parsedUrl.pathname; /* The path section of the URL, that comes after the host and before the query
                                      //, including the initial slash if present. Example: '/p/a/t/h' */
  var hostname   = parsedUrl.hostname;
  var tailleFile = ec ? parseInt(ec.size, 10) : undefined; // because size could be a string (comming from the test CSV)
  var match;
  // exemple http://cshprotocols.cshlp.org/content/2012/5/pdb.top069344.full.pdf
  //console.error(parsedUrl);
  /*
{ protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'cshprotocols.cshlp.org',
  port: null,
  hostname: 'cshprotocols.cshlp.org',
  hash: null,
  search: '',
  query: {},
  pathname: '/content/2012/5/pdb.top069344.full.pdf',
  path: '/content/2012/5/pdb.top069344.full.pdf',
  href: 'http://cshprotocols.cshlp.org/content/2012/5/pdb.top069344.full.pdf' }
  */

  // it is necessary to check weight of page, if < 10 ko it is not the article but login page
  if ((match = /^\/content\/.*\.full$/.exec(pathname)) !== null && (!tailleFile || tailleFile > 10000)) {
    // example : http://rsbl.royalsocietypublishing.org/content/6/4/458.full
    result.title_id = hostname;
    result.unitid   = hostname + pathname.replace(/\.full$/, '');
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }

  if ((match = /^\/content\/.*\.full\.pdf$/.exec(pathname)) !== null) {
    // example : http://cshprotocols.cshlp.org/content/2012/5/pdb.top069344.full.pdf
    result.title_id = hostname;
    result.unitid   = hostname + pathname.replace(/\.full\.pdf$/, '');
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
  }

  return result;
});
