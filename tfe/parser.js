#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Taylor & Francis eBooks
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/doi\/([a-z]+)\/(([0-9]{2}\.[0-9]{4})\/([0-9]+))$/i.exec(path)) !== null) {
    // http://www.tandfebooks.com/doi/view/10.4324/9781315879871
    result.rtype = 'BOOK';
    result.mime = 'MISC';
    result.online_identifier = match[4];
    result.unitid = match[4];
    result.doi = match[2];
    if (match[1] === 'pdf') {
      result.mime = 'PDF';
    }
  } else if ((match = /^\/action\/([a-z]+)$/i.exec(path)) !== null) {
    // /action/ShowBook?doi=10.4324/9781315771137
    result.rtype = 'ABS';
    result.mime = 'HTML';
    if (param && param.doi) {
      result.online_identifier = param.doi.split('/')[1];
      result.unitid = param.doi.split('/')[1];
      result.doi = param.doi;
    }

  } else if ((match = /^\/books\/[a-z]+\/(10.[0-9]+\/([0-9]+))\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /books/mono/10.4324/9781315108155/miscanthus-bioenergy-production-michael-jones
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.doi = match[1];
    result.unitid = match[2];
  }

  return result;
});

