#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Royal Society of Chemistry
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;
  var hashedUrl;

  if (parsedUrl.hash) {
    var URL  = require('url');
    hashedUrl = URL.parse(parsedUrl.hash.replace("#!","/?"), true);
  }

  if ((match = /^\/en\/journals\/journalissues\/([a-zA-Z]{2,})$/.exec(path)) !== null) {
    // https://pubs-rsc-org.bibliopam-evry.univ-evry.fr/en/journals/journalissues/ay
    // #!issueid=ay006014&type=current&issnprint=1759-9660
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    if (hashedUrl && hashedUrl.query) {
      if (hashedUrl.query.issnprint) {
        result.print_identifier = hashedUrl.query.issnprint;
      }
      if (hashedUrl.query.issueid) { result.unitid = hashedUrl.query.issueid; }
    }
  } else if ((match = /^\/en\/content\/article(html|pdf)\/([0-9]+)\/([^\/]+)\/([^\/]+)$/.exec(path)) !== null) {
    // https://pubs-rsc-org.bibliopam-evry.univ-evry.fr/en/content/articlehtml/2014/rp/c4rp00006d
    result.rtype    = 'ARTICLE';
    result.mime     = match[1].toUpperCase();
    result.title_id = match[3].toLowerCase();
    result.unitid   = match[4].toLowerCase();
    result.publication_date = match[2];
    result.doi = '10.1039/' + match[4];
  } else if ((match = /^\/en\/content\/ebook\/([^\/]+)$/.exec(path)) !== null) {
    // https://pubs-rsc-org.bibliopam-evry.univ-evry.fr/en/content/ebook/978-1-84973-424-0#!divbookcontent
    if (hashedUrl && hashedUrl.query && hashedUrl.query.divbookcontent === '') { result.rtype    = 'TOC'; }
    result.mime     = 'MISC';
    result.title_id = result.unitid = result.print_identifier = match[1];
    result.print_identifier = match[1].split('#')[0];
  } else if ((match = /^\/en\/content\/chapterpdf\/([0-9]+)\/([^\/]+)$/.exec(path)) !== null) {
    // https://pubs-rsc-org.bibliopam-evry.univ-evry.fr/en/content/chapterpdf/2013/9781849734738-00001
    // ?isbn=978-1-84973-424-0&sercode=bk
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid = match[2];
    result.publication_date = match[1];
    result.doi = '10.1039/' + match[2];
    if (parsedUrl.query && parsedUrl.query.isbn) {
      result.title_id = result.print_identifier = parsedUrl.query.isbn;
    }
  }

  return result;
});

