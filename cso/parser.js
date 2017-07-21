#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform chicago scholarship online
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

  if ((match = /^\/[a-z]+\/([0-9]+\.[0-9]+\/[a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+\/([a-z]+-([0-9]+))$/i.exec(path)) !== null) {
    // /view/10.7208/chicago/9780226243276.001.0001/upso-9780226243238
    result.rtype             = 'BOOK';
    result.mime              = 'HTML';
    result.doi               = match[1];
    result.unitid            = match[3];
    result.print_identifier  = match[4];
    result.online_identifier = match[2];

  } else if ((match = /^\/[a-z]+\/([0-9]+\.[0-9]+\/[a-z]+\/([0-9]+))\.[0-9]+\.[0-9]+\/([a-z]+-([0-9]+)-[a-z]+-[0-9]+)$/i.exec(path)) !== null) {
    // http://chicago.universitypressscholarship.com/view/10.7208/chicago/9780226243276.001.0001/upso-9780226243238-chapter-1
    // http://chicago.universitypressscholarship.com/view/10.7208/chicago/9780226243276.001.0001/upso-9780226243238-chapter-1?print=pdf
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'HTML';

    if (param.print && param.print == 'pdf') {
      result.rtype = 'BOOK';
      result.mime  = 'PDF';
    }

    result.doi               = match[1];
    result.unitid            = match[3];
    result.print_identifier  = match[4];
    result.online_identifier = match[2];

  } else if (/^\/[a-z]+$/i.test(path)) {
    // /browse?t=OSO:history
    result.rtype = 'TOC';
    result.mime  = 'HTML';

    if (param.t) {
      result.unitid = param.t;
    }
  }

  return result;
});
