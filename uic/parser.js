#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Underground and Independant Comics
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
  if ((match = /^\/(View|view)\/([0-9]+)$/.exec(path)) !== null) {
    ///View/1685699
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/UIV\/([0-9]+)$/.exec(path)) !== null) {
    ///UIV/1685679?view=galleryview
    result.rtype    = 'BOOK';
    result.mime     = 'MISC';
    if (param.view) {
      result.mime     = 'HTML';
    }
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/([a-z]+)\/([A-Za-z]+)\/([A-Za-z]+)\/([0-9]+)$/.exec(path)) !== null) {
    ///view/ImageToPDFDownload/EntityId/1659501
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[4];
  }

  return result;
});

