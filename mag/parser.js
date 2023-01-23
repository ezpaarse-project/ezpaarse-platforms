#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MAG Online
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

  if ((match = /^\/doi\/(epdf|epdfplus)\/(([0-9.]+)\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://www.magonlinelibrary.com/doi/epdf/10.12968/hmed.2020.0321
    // https://www.magonlinelibrary.com/doi/epdfplus/10.12968/hmed.2020.0321
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi = match[2];
    result.unitid = match[2];
  } else if ((match = /^\/doi\/epub\/(([0-9.]+)\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://www.magonlinelibrary.com/doi/epub/10.12968/hmed.2020.0321
    result.rtype    = 'ARTICLE';
    result.mime     = 'EPUB';
    result.doi = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/doi\/full\/(([0-9.]+)\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://www.magonlinelibrary.com/doi/full/10.12968/chhe.2022.3.2.62
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/doi\/abs\/(([0-9.]+)\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://www.magonlinelibrary.com/doi/abs/10.12968/live.2021.26.1.6
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi = match[1];
    result.unitid = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://www.magonlinelibrary.com/action/doSearch?AllField=COVID
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
