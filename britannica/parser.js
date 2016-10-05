#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Britannica
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/event\/([a-z\-]+)$/i.exec(path)) !== null) {
    ///event/Harlem-Renaissance-American-literature-and-art
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/quiz\/([a-z\-]+)$/i.exec(path)) !== null) {
    ///quiz/art-of-the-harlem-renaissance
    result.rtype    = 'EXO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/biography\/([a-z\-]+)$/i.exec(path)) !== null) {
    ///biography/Billy-Wilder
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/list\/([a-z]+)$/i.exec(path)) !== null) {
    ///https://www.britannica.com/list/browse
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/levels\/([a-z]+)\/([a-z]+)\/(([0-9]+)?([a-z]+)?)(\/([a-z]+))?(\/([0-9]+))?$/.exec(path)) !== null) {
    ///levels/collegiate/article/470856
    //levels/collegiate/additionalcontent/primarysources?id=127472&path=/primary_source/gutenberg/PGCC_classics_02/16978-8.htm
    //levels/collegiate/browse/atlas
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';

    if (match[7] && match[7] == 'media') {
      result.rtype = 'IMAGE';
      result.mime  = 'MISC';
    }
    result.unitid   = match[4];
    if (param.id) {
      result.unitid = param.id;
      result.rtype  = 'BOOK';
    } else if (match[2] == 'browse') {
      result.unitid = match[5];
      result.rtype  = 'MAP';
    } else if (match[5] == 'article') {
      result.unitid = match[9];
      result.rtype  = 'ARTICLE';
    }

  }

  return result;
});

