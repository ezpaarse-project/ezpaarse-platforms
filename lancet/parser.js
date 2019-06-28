#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doi_prefix = '10.1016';

/**
 * Recognizes the accesses to the platform The Lancet
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

  if ((match = /^\/pb\/assets\/.*\/(.*).mp3$/i.exec(path)) !== null) {
    // http://download.thelancet.com:80/pb/assets/raw/Lancet/conferences/audio-video/hons-day1-1.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/pb-assets\/.*\/(.*).mp3$/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/pb-assets/Lancet/stories/audio/lancet/2017/30october_countdown.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // http://www.thelancet.com:80/action/doSearch?collecIdFltr=001536&searchScope=fullSite&searchType=collection&journalCode=&searchText=blunt+trauma&occurrences=all
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/journals\/[a-z]+\/article\/PII(.*?)\/(.*)$/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/journals/lancet/article/PIIS0140-6736(11)60887-8/fulltext    // http://www.thelancet.com:80/journals/langas/article/PIIS2468-1253(18)30081-5/supplemental
    // http://www.thelancet.com:80/journals/langas/article/PIIS2468-1253(18)30094-3/references
    result.doi      = doi_prefix + '/' + match[1];
    result.pii      = match[1];
    result.title_id = match[1];
    result.unitid   = match[1];
    result.mime     = 'HTML';
    if (match[2] === 'fulltext') {
      result.rtype  = 'ARTICLE';
    } else if (match[2] === 'supplemental') {
      result.rtype  = 'SUPPL';
    } else if (match[2] === 'references') {
      result.rtype  = 'REF';
    } else if (match[2] === 'ppt') {
      result.rtype  = 'IMAGE';
      result.mime   = 'MISC';
    }
  } else if ((match = /^\/pdfs\/journals\/[a-z]+\/PII(.*?).pdf$/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/pdfs/journals/lancet/PIIS0140-6736(11)60887-8.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = doi_prefix + '/' + match[1];
    result.pii      = match[1];
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/article\/(.*)\/abstract/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/article/S1473-3099(17)30438-3/abstract
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = doi_prefix + '/' + match[1];
    result.pii      = match[1];
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/infographics\/(.*)$/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/infographics/syria
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/interactive-grand-round\/(.*)$/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/interactive-grand-round/central-vision-loss
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/journals\/[a-z]+\/article\/PII(.*?)\/ppt$/i.exec(path)) !== null) {
    // http://www.thelancet.com:80/journals/lancet/article/PIIS0140-6736(11)60887-8/ppt
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.doi      = doi_prefix + '/' + match[1];
    result.pii      = match[1];
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
