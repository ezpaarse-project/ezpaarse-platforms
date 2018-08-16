#!/usr/bin/env node
'use strict';
const Parser = require('../.lib/parser.js');
/**
 * Recognizes the accesses to the platform Journal of Urology
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
  if ((match = /^\/action\/doSearchSecure$/i.exec(path)) !== null) {
    // https://journal.chestnet.org:443/action/doSearchSecure?searchType=quick&searchText=brain&occurrences=all&journalCode=chest&searchScope=fullSite&code=chest-site
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/article\/([A-Z0-9-()]+)\/([a-z]+)$/i.exec(path)) !== null) {
    // https://journal.chestnet.org:443/article/S0012-3692(17)31547-7/fulltext
    result.rtype    = 'ARTICLE';
    result.pii      = match[1];
    result.unitid   = match[1] + '/' + match[2];
    switch (match[2]) {
    case 'fulltext':
      result.mime = 'HTML';
      break;
    case 'pdf':
      result.mime = 'PDF';
      break;
    case 'ppt':
      result.mime = 'MISC';
      break;
    }
  } else if (/^\/current|issues|inpressi|meetings|mulitmedia|supplements|content|ultrasound|pearls|giants|podcast|chest|reports|asthma/i.test(path)) {
    // https://journal.chestnet.org:443/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/issue\/([A-Z0-9()-]+)$/i.exec(path)) !== null) {
    // https://journal.chestnet.org:443/issue/S0012-3692(17)X0003-2
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.pii      = match[1];
  } else if ((match = /^\/cms\/[a-z]+\/[a-z0-9-]+\/([a-z0-9]+).mp4$/i.exec(path)) !== null) {
    // https://journal.chestnet.org:443/cms/attachment/a8cf188e-8b14-429f-8800-0940c91678b8/mmc1.mp4
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  }

  return result;
});
