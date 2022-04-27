#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Numilog
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let param  = parsedUrl.query || {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/play\/playstream$/i.exec(path)) !== null) {
    // /Play/PlayStream
    result.rtype    = 'AUDIO';
    result.mime     = 'HTML';

  } else if ((match = /^\/bibliotheque\/[a-z0-9-_]+\/fiche_livre.asp$/i.exec(path)) !== null) {
    // /bibliotheque/univ-evry/fiche_livre.asp?idprod=55259
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
  } else if (/^\/extrait\/extrait.asp$/i.test(path)) {
    // /extrait/extrait.asp?id_livre=48436
    result.rtype    = 'PREVIEW';
    result.mime     = 'HTML';
  } else if ((match = /^\/v[0-9]+\/+link\/[0-9]+\/[a-z]+\/[0-9]+\/([0-9]+)-[a-z0-9]+\.do$/i.exec(path)) !== null) {
    // /v3//link/3056000654504/LOAN/210618807736100417775588/9782815933100-C70YSCB1IKDU6N9P5XPVOJRSYB7YQ73C.do
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[1];
    result.online_identifier = match[1];
  } else if ((match = /^\/[0-9]+\/catalog\/book\/([0-9]+)\/(.*)$/i.exec(path)) !== null) {
    // /657/Catalog/Book/1088509/La%C3%AFcit%C3%A9-ou-Islam-Mission-possible
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/reader$/i.test(path)) {
    // /reader?ISBN=9791031011639&Token=1744bd37-6475-4eec-9806-7463928888d9
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = param.ISBN;
    result.online_identifier = param.ISBN;
  } else if (/^\/[0-9]+\/catalog\/search$/i.test(path)) {
    // /244/Catalog/Search?query=oraux&type=Title&pageindex=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
