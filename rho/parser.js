#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const doi_prefix = '10.4324/';

/**
 * Recognizes the accesses to the platform Routledge Handbooks Online
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

  if ((match = /^\/author\/(.*)$/i.exec(path)) !== null) {
    // https://www.routledgehandbooks.com:443/author/Denise%20D._Bielby
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/(([0-9.]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // https://www.routledgehandbooks.com:443/doi/10.4324/9780203066911
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.online_identifier = match[3];
    result.unitid   = match[3];
    result.title_id  = match[3];
  } else if ((match = /^\/doi\/(([0-9.]+)\/([0-9]+))([.a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.routledgehandbooks.com:443/doi/10.4324/9780203066911.ch12
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.online_identifier = match[3];
    result.title_id = match[3];
    result.unitid   = match[3] + match[4];
  } else if ((match = /^\/pdf\/doi\/(([0-9.]+)\/([0-9]+))([a-z.0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.routledgehandbooks.com:443/pdf/doi/10.4324/9781315612959.ch2/1517860691622
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.doi      = match[1];
    result.online_identifier = match[3];
    result.title_id = match[3];
    result.unitid   = match[5];
  } else if ((match = /^\/pdf\/suppl\/assets\/([0-9]+)\/suppl\/(.*)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.routledgehandbooks.com:443/pdf/suppl/assets/9780203066911/suppl/9780203066911_Prelims.pdf/1517860783712
    result.rtype    = 'SUPPL';
    result.mime     = 'PDF';
    result.doi      = doi_prefix + match[1];
    result.online_identifier = match[1];
    result.title_id = match[2];
    result.unitid   = match[3];
  } else if (/^\/search$/i.test(path)) {
    // https://www.routledgehandbooks.com:443/search?searchtext=freud&text=freud&page=0&size=10&sort=score%2Cdesc&docType=chapter&openAccessContent=true&researchInterestAcademic=false&researchInterestPractitioner=false
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
