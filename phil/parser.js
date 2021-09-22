#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Philpapers
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

  if ((match = /^\/rec\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /rec/PROOFE
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/archive\/([a-z0-9-_]+).pdf$/i.exec(path)) !== null) {
    // /archive/UNLAOO.pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/archive\/([a-z0-9-_]+).docx$/i.exec(path)) !== null) {
    // /archive/NELAAT-6.docx
    result.rtype = 'ARTICLE';
    result.unitid = match[1];
  } else if ((match = /^\/pub\/([0-9]+)$/i.exec(path)) !== null) {
    // /pub/22
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = `pub/${match[1]}`;
  }

  return result;
});
