#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Dalloz Forum Famille
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([\w\-]+)\/?$/i.exec(path)) !== null) {
    //2016/09/30/au-journal-officiel-des-25-et-30-septembre-2016-protection-de-lenfant/
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.publication_date = match[1];
    result.unitid   = match[4];
  } else if ((match = /^\/category\/([\w\-]+)\/?$/i.exec(path)) !== null) {
    //category/assistance-educative/
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});

