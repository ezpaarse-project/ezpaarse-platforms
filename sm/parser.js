#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Symptom Media
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/film-previews\/([a-z-]+)\/?/i.exec(path)) !== null) {
    // /film-previews/mental-health-nursing-film-collection/
    result.rtype = 'PREVIEW';
    result.mime = 'MISC';
    result.unitid = match[1];
  } else if ((match = /^\/(film-library)\/?/i.exec(path)) !== null) {
    // /film-library/
    // /film-library/#v1coping
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = parsedUrl.hash ? parsedUrl.hash.substr(1, parsedUrl.hash.length) : match[1];
  } else if ((match = /^\/about-us\/([a-z-]+)/i.exec(path)) !== null) {
    // /film-library/
    // about-us/customers/
    result.rtype = 'METADATA';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/training-title-([a-z0-9]+)\/?/i.exec(path)) !== null) {
    // /training-title-17/
    result.rtype = 'EXERCISE';
    result.mime = 'MISC';
    result.unitid = match[1];
  } else if ((match = /^\/([a-z0-9-]+)\/?/i.exec(path)) !== null) {
    // /arnie-opioid-use-disorder-anxiety-assessment-v1/
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];
  }

  return result;
});
