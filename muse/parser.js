#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';

var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};

  var match;

  if ((match = /^\/journals\/(([^\/]+)\/(toc|summary)\/(.*)).html$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu/journals/george_herbert_journal/toc/ghj.34.1-2.html
    
    result.unitid   = match[1];
    result.title_id = match[2];
    //result.print_identifier = match[1] + '-' + match[2];
    if (match[3] == 'toc') { result.rtype    = 'TOC'; }
    else { result.rtype    = 'ABS'; }
    result.mime     = 'MISC';
  } else if ((match = /^\/journals\/(([^\/]+)\/([^\/]+)\/(.*)).(pdf|html)$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/journals/george_herbert_journal/v034/34.1-2.newton.pdf
    // http://muse.jhu.edu:80/journals/george_herbert_journal/v034/34.1-2.newton.html
    result.unitid   = match[1];
    result.title_id = match[2];
    //result.print_identifier = match[1] + '-' + match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = match[5].toUpperCase();
  } else if ((match = /^\/journals\/([^\/]+)\/$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/journals/american_catholic_studies/
    result.unitid   = match[1];
    result.title_id = match[1];
    //result.print_identifier = match[1] + '-' + match[2];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
  } else if ((match = /^\/login$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu/login?auth=0&type=summary&url=/journals/american_book_review/v034/34.4.irr.pdf
    if (param.type && param.url && param.type === 'summary') {
      var match_url;
      if ((match_url = /^\/journals\/(([^\/]+)\/(.*)).(pdf|html)/.exec(param.url)) !== null) {
        result.unitid   = match_url[1];
        result.title_id = match_url[2];
        //result.print_identifier = match[1] + '-' + match[2];
        result.rtype    = 'ABS';
        result.mime     = 'MISC';
      }
    }
  } else if ((match = /^\/books\/([^\/]+)$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/books/9781421401737
    result.unitid   = match[1];
    result.title_id = match[1];
    result.print_identifier = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
  } else if ((match = /^\/books\/([^\/]+)\/(([^-]+)([-]?)(.*)).pdf$/.exec(parsedUrl.pathname)) !== null) {
    // http://muse.jhu.edu:80/books/9781421401737/9781421401737-7.pdf
    result.unitid   = match[2];
    result.title_id = match[3];
    result.print_identifier = match[3];
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
  }

  return result;
});