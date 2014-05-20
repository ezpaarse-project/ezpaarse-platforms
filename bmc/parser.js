#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result   = {};
  var domain   = parsedUrl.hostname; /* Just the lowercased hostname portion of the host. Example: 'host.com' */
  var pathname = parsedUrl.pathname; /* The path section of the URL, that comes after the host and before the query, including the initial slash if present. Example: '/p/a/t/h' */

  var match;

  // OK exemple http://www.biomarkerres.org/content/pdf/2050-7771-1-14.pdf
  //console.error(parsedUrl);
  /* { protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'www.biomarkerres.org',
  port: null,
  hostname: 'www.biomarkerres.org',
  hash: null,
  search: null,
  query: null,
  pathname: '/content/pdf/2050-7771-1-14.pdf',
  path: '/content/pdf/2050-7771-1-14.pdf',
  href: 'http://www.biomarkerres.org/content/pdf/2050-7771-1-14.pdf' }
  */
  //console.error(domain);
  //www.biomarkerres.org

  //console.error(pathname);
  ///content/pdf/2050-7771-1-14.pdf

  //console.error(result.title_id);
  //www.biomarkerres.org ici result.title_id = domain
//



  if (domain == 'www.biomedcentral.com') {


    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})(\/[0-9]+){2})\/abstract$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2253/13/5/abstract
      result.unitid = match[1];
      result.print_identifier  = match[2];
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
    }

    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})\/[0-9]+(\/[A-Z][0-9]+){2})\/abstract$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2105/13/S18/A1/abstract
      result.unitid = match[1];
      result.print_identifier  = match[2];
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
    }

    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})(\/[0-9]+){2})$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2253/13/5
      result.unitid = match[1];
      result.print_identifier  = match[2];
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }

    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})\/[0-9]+(\/[A-Z][0-9]+){2})$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2105/13/S18/A1
      result.unitid = match[1];
      result.print_identifier  = match[2];
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }

    if ((match = /^\/content\/pdf\/(([0-9]{4}-[0-9]{3}[0-9xX]{1}).*)\.pdf$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/content/pdf/1471-2253-13-5.pdf
      // example : http://www.biomedcentral.com/content/pdf/1471-2105-13-S18-A1.pdf
      result.unitid = match[1];
      result.print_identifier  = match[2];
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }

  } else {

    if ((match = /^\/content((\/[0-9]+){3})\/abstract$/.exec(pathname)) !== null) {
      // example : http://www.biomarkerres.org/content/1/1/14/abstract
      // example : http://stemcellres.com/content/3/4/23/abstract
      result.unitid = domain + match[1];
      result.title_id    = domain;
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
    }

    if ((match = /^\/content(\/[0-9]+(\/[A-Z][0-9]+){2})\/abstract$/.exec(pathname)) !== null) {
      // example : http://respiratory-research.com/content/14/S1/S7/abstract
      // example : http://ccforum.com/content/13/S5/S3/abstract
      result.unitid = domain + match[1];
      result.title_id    = domain;
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
    }

    if ((match = /^\/content(\/[0-9]+(\/[A-Z]?[0-9]+){2})$/.exec(pathname)) !== null) {
      // example : http://www.biomarkerres.org/content/1/1/14
      // example : http://respiratory-research.com/content/14/S1/S7
      result.unitid = domain + match[1];
      result.title_id    = domain;
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }

    if ((match = /^\/content\/pdf\/(.*)\.pdf$/.exec(pathname)) !== null) {
      // example : http://www.biomarkerres.org/content/pdf/2050-7771-1-14.pdf
      result.unitid = domain + '/' + match[1];
      result.title_id    = domain;
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }

  }
  return result;
});
