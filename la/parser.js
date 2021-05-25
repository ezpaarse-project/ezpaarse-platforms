#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Library Aware
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/([0-9]+)\/Subscribers\/Subscribe$/i.exec(path)) !== null) {
    // http://www.libraryaware.com/431/Subscribers/Subscribe?showonlynewsletterlists=true
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';

  } else if ((match = /^\/([0-9]+)\/NewsletterIssues\/ViewIssue\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // http://www.libraryaware.com/431/NewsletterIssues/ViewIssue/44bdd3a6-fc60-4357-a4dc-6fbe5456f571?postId=af37a17d-1935-49a9-a2f6-b7a16d938508
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://libraryaware.com/29HPM9
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
