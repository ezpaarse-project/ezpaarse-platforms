#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Studies on Alcohol and Drugs
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

  if (/^\/action\/doSearch/i.test(path)) {
    // https://www.jsad.com:443/action/doSearch?AllField=bananas
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9.]+\/([a-z0-9.]+))$/i.exec(path)) !== null) {
    // https://www.jsad.com:443/doi/abs/10.15288/jsa.1982.43.146
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (match[1] === 'pdf') {
      result.mime = 'PDF';
    } else if (match[1].toLowerCase() === 'abs') {
      result.rtype = 'ABS';
    } else if (match[1].toLowerCase() === 'ref') {
      result.rtype = 'REF';
    } else if (match[1].toLowerCase() === 'suppl') {
      result.rtype = 'SUPPL';
    } else if (match[1].toLowerCase() === 'citedby') {
      result.rtype = 'CITEDBY';
    }
    result.doi      = match[2].toLowerCase();
    result.unitid   = match[3].toLowerCase();
  } else if ((match = /^\/toc\/(([a-z]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // https://www.jsad.com:443/toc/jsad/79/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.vol      = match[3];
    result.issue    = match[4];
    result.unitid   = match[1];
  } else if (/^\/loi\/jsad$/i.test(path)) {
    // https://www.jsad.com:443/loi/jsad
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }

  return result;
});
