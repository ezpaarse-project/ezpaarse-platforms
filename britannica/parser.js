#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Britannica
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  let match;

  if ((match = /^\/event\/([a-z-]+)$/i.exec(path)) !== null) {
    // /event/Harlem-Renaissance-American-literature-and-art
    result.rtype  = 'ENCYCLOPAEDIA_ENTRY';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/quiz\/([a-z-]+)$/i.exec(path)) !== null) {
    // /quiz/art-of-the-harlem-renaissance
    result.rtype  = 'EXO';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/biography\/([a-z-]+)$/i.exec(path)) !== null) {
    // /biography/Billy-Wilder
    result.rtype  = 'BIO';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/list\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.britannica.com/list/browse
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if ((match = /^\/levels\/([a-z]+)\/([a-z]+)\/([0-9]+|[a-z]+)(\/([a-z]+))?(\/([0-9]+))?$/.exec(path)) !== null) {
    // /levels/collegiate/article/470856
    // /levels/collegiate/additionalcontent/primarysources?id=127472&path=/primary_source/gutenberg/PGCC_classics_02/16978-8.htm
    // /levels/collegiate/browse/atlas
    result.rtype  = 'ENCYCLOPAEDIA_ENTRY';
    result.mime   = 'HTML';
    result.unitid = match[3];

    if (match[5] === 'media') {
      result.rtype = 'IMAGE';
      result.mime  = 'MISC';
    }
    if (param.id) {
      result.unitid = param.id;
      result.rtype  = 'BOOK';
    } else if (match[2] === 'browse') {
      result.unitid = match[3];
      result.rtype  = 'MAP';
    } else if (match[3] === 'article') {
      result.unitid = match[7];
      result.rtype  = 'ARTICLE';
    }

  }

  return result;
});

