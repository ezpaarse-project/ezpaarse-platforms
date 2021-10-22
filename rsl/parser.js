#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Royal Society of London
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let param = parsedUrl.query || {};
  let match;

  if ((match = /^\/journal\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /journal/rsob
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];

  } else if ((match = /^\/toc\/(([a-z0-9]+)\/(\d{4})\/(\d+)\/(\d+))$/i.exec(path)) !== null) {
    // /toc/rsob/2021/11/3
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[4];
    result.issue    = match[5];

    result.publication_date = match[3];

  } else if ((match = /^\/doi(\/pdf)?\/(10\.[0-9]+\/(([a-z]+)[0-9.]+))$/i.exec(path)) !== null) {
    // /doi/10.1098/rsos.201912
    // /doi/pdf/10.1098/rsos.201912
    result.rtype    = 'ARTICLE';
    result.mime     = match[1] ? 'PDF' : 'HTML';
    result.doi      = match[2];
    result.unitid   = match[3];
    result.title_id = match[4];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://royalsocietypublishing.org/action/doSearch?AllField=rocks
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid = param.AllField;
  }

  return result;
});
