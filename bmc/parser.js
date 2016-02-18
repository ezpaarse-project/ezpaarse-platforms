#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result   = {};
  var domain   = parsedUrl.hostname; /* Just the lowercased hostname portion of the host. Example: 'host.com' */
  var pathname = parsedUrl.pathname; /* The path section of the URL, that comes after the host and before the query, including the initial slash if present. Example: '/p/a/t/h' */
  var info;
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
      info                    = match[1].split('/');
      result.unitid           = match[1];
      result.print_identifier = match[2];
      result.vol              = info[1];
      result.issue            = info[2];
      result.rtype            = 'ABS';
      result.mime             = 'HTML';
    }

    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})\/([0-9]+)(\/[A-Z][0-9]+){2})\/abstract$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2105/13/S18/A1/abstract
      result.vol              = match[3];
      result.unitid           = match[1];
      result.print_identifier = match[2];

      result.rtype = 'ABS';
      result.mime  = 'HTML';
    }

    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})(\/[0-9]+){2})$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2253/13/5
      info                    = match[1].split('/');
      result.unitid           = match[1];
      result.print_identifier = match[2];
      result.vol              = info[1];
      result.issue            = info[2];

      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
    }

    if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9xX]{1})\/[0-9]+(\/[A-Z][0-9]+){2})$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/1471-2105/13/S18/A1
      info = match[1].split('/');

      result.unitid           = match[1];
      result.print_identifier = match[2];
      result.vol              = info[1];

      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
    }

    if ((match = /^\/content\/pdf\/(([0-9]{4}-[0-9]{3}[0-9xX]{1}).*)\.pdf$/.exec(pathname)) !== null) {
      // example : http://www.biomedcentral.com/content/pdf/1471-2253-13-5.pdf
      // example : http://www.biomedcentral.com/content/pdf/1471-2105-13-S18-A1.pdf

      info = match[1].split('-');
      result.vol = info[2];

      if (!isNaN(info[3])) {
        result.issue = info[3];
      }

      result.doi  = '10.1186/' + match[1];
      result.unitid = match[1];
      result.print_identifier = match[2];

      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    }
    if ((match = /^\/([a-z]+)\/content\/([0-9]+)\/([A-Za-z]+)\/([0-9]+)$/.exec(pathname)) !== null) {
      // example :http://www.biomedcentral.com/bmcanesthesiol/content/11/October/2011
       result.unitid = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4];
       result.print_identifier  = match[1];
       result.rtype  = 'TOC';
       result.mime   = 'MISC';
       result.publication_date = match[4];
     }
  } else {
    if ((match = /^\/([a-z]+)/.exec(pathname)) !== null) {
      // example : http://bmcbiol.biomedcentral.com/articles
      result.title_id    = domain.split('.')[0];
      result.rtype  = 'TOC';
      result.mime   = 'MISC';
    }

    if ((match = /^\/content((\/[0-9]+){3})\/abstract$/.exec(pathname)) !== null) {
      // example : http://www.biomarkerres.org/content/1/1/14/abstract
      // example : http://stemcellres.com/content/3/4/23/abstract

      info              = match[1].split('/');
      result.unitid     = domain + match[1];
      result.title_id   = domain;
      result.vol        = info[1];
      result.issue      = info[2];
      result.first_page = info[3];
      result.rtype      = 'ABS';
      result.mime       = 'HTML';
    }

    if ((match = /^\/content(\/[0-9]+(\/[A-Z][0-9]+){2})\/abstract$/.exec(pathname)) !== null) {
      // example : http://respiratory-research.com/content/14/S1/S7/abstract
      // example : http://ccforum.com/content/13/S5/S3/abstract

      info            = match[1].split('/');
      result.vol      = info[1];
      result.unitid   = domain + match[1];
      result.title_id = domain;
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
    }

    if ((match = /^\/content(\/[0-9]+(\/[A-Z]?[0-9]+){2})$/.exec(pathname)) !== null) {
      // example : http://www.biomarkerres.org/content/1/1/14
      // example : http://respiratory-research.com/content/14/S1/S7

      info            = match[1].split('/');
      result.unitid   = domain + match[1];
      result.title_id = domain;
      result.vol      = info[1];

      if (!isNaN(info[2])) {
        result.issue = info[2];
        result.first_page = info[3];
      }

      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
    }

    if ((match = /^\/content\/pdf\/(.*)\.pdf$/.exec(pathname)) !== null) {
      // example : http://www.biomarkerres.org/content/pdf/2050-7771-1-14.pdf

      info = match[1].split('-');
      result.vol = info[2];

      if (!isNaN(info[0])) {
        result.print_identifier = info[0] + '-' + info[1];
      }

      result.doi      = '10.1186/' + match[1];
      result.unitid   = domain + '/' + match[1];
      result.title_id = domain;
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    }

    if ((match = /^\/([a-z]+)\/pdf\/([0-9]{2}\.[0-9]{4})\/(.*)$/.exec(pathname)) !== null) {
      // example : http://bmcgenomics.biomedcentral.com.gate1.inist.fr/track/pdf/10.1186/s12864-016-2404-0
       result.doi      = match[2] + '/' + match[3];
       result.unitid   =  match[3];
       result.title_id = domain.split('.')[0];
       result.rtype    = 'ARTICLE';
       result.mime     = 'PDF';
     }
    if ((match = /^\/articles\/([0-9]{2}\.[0-9]{4})\/(.*)$/.exec(pathname)) !== null) {
      // example :http://bmcbiol.biomedcentral.com/articles/10.1186/s12915-016-0229-6
      result.doi      = match[1] + '/' + match[2];
      result.unitid   =  match[2];
      result.title_id = domain.split('.')[0];
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    }

  }
  return result;
});
