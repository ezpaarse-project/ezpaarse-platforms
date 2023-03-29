#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const doiPrefix = '10.1083';

/**
 * Recognizes the accesses to the platform Rockfeller University Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if ((match = /^\/([a-z]+)\/article(-pdf)?\/([0-9]+)\/([0-9]+)\/e([0-9]+)\/([0-9]+)\/[a-z0-9_.-]+$/i.exec(path)) !== null) {
    // /jcb/article/222/4/e202203036/213901/Antagonism-between-Prdm16-and-Smad4-specifies-the
    // /jcb/article-pdf/222/4/e202203036/1448319/jcb_202203036.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = match[2] ? 'PDF' : 'HTML';
    result.title_id = match[1];
    result.vol      = match[3];
    result.issue    = match[4];
    result.unitid   = `${result.title_id}.${match[5]}`;
    result.doi      = `${doiPrefix}/${result.unitid}`;

  } else if ((match = /^\/([a-z]+)\/issue\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // /jcb/issue/222/1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.vol      = match[2];
    result.issue    = match[3];
    result.unitid   = `${result.title_id}/${result.vol}/${result.issue}`;

  } else if ((match = /^\/rup\/content_public\/journal\/([a-z]+)\/issue\/([0-9]+)\/([0-9]+)\/[0-9]+\/[a-z0-9_-]+\.pdf$/i.exec(path)) !== null) {
    // /rup/content_public/journal/jcb/issue/222/1/2/jcb_222_1_toc.pdf?Expires=1680528932&Signature=No1b0~OZJehxkq8~6x9Zqip~p3u~hE26wuKy4RDGrFb59GQGDH3HzqoVAE7twpGasuLlXRtU3JXKRv0fHhDUIcSQ7bkkce3BtKEz-pPwPtuu-Rnubddumg7OQply8ecasEPMrPGI-P8Xo~qUiacMl~RAyb23dxoWqgyWFOoA3qJ~QrRkJnoxaPmlAmmiiDEvu2BHT2WEIwy9GQnotN2CgQVfsiegpjE~3qtg0cuufaFSyrnmnupx7JSKtOzDDLM4IVSRJ~SCnNOOGc3-0-6hYdHlBeNNO0AfRjQLCSZxPNx75JkQdL8hXP3tvc3VmLcsZTnCYvfq3aNDVcfHZQBQ3A__&Key-Pair-Id=APKAIE5G5CRDK6RD3PGA
    result.rtype    = 'TOC';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.vol      = match[2];
    result.issue    = match[3];
    result.unitid   = `${result.title_id}/${result.vol}/${result.issue}`;

  } else if (/^\/[a-z]+\/search-results$/i.test(path)) {
    // /jcb/search-results?page=1&q=cancer&fl_SiteID=1000001
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
