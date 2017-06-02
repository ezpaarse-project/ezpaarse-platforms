#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Discovery Education
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

  if (/^\/video\/$/.test(path)) {
    // http://ekb.discoveryeducation.com/video/?guid=a020a716-20c4-48f8-9329-053fd6e860d4
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = param.guid;
  }

  return result;
});

