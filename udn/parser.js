#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Reading UDN
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  //let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/read\/story\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://reading.udn.com/read/story/123402/7950325?from=udn_ch1014_listnews_123402
    // https://reading.udn.com/read/story/123402/7991369?from=udn_ch1014_listnews_123402
    // https://reading.udn.com/read/story/123402/8081033?from=udn_ch1014_listnews_123402
    // https://reading.udn.com/read/story/7048/6968432
    // https://reading.udn.com/read/story/7049/8133457
    // https://reading.udn.com/read/story/122749/8155769?from=udn-catelistnews_ch1014
    // https://reading.udn.com/read/story/122749/8131278?from=udn_ch1014_authorarticle_5323
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = `${match[1]}/${match[2]}`;

  } else if (/^\/read\/search\/([a-zA-Z0-9_-]+)$/i.test(path)) {
    // https://reading.udn.com/read/search/English
    // https://reading.udn.com/read/search/NBA
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/read\/cate\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://reading.udn.com/read/cate/10859/122857
    // https://reading.udn.com/read/cate/7007/7048
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = `${match[1]}/${match[2]}`;

  } else if (/^\/udnlib\/[a-zA-Z0-9-]+\/booksearch$/i.test(path)) {
    // https://reading.udn.com/udnlib/ntust/booksearch?sort=all&opt=all&kw=%E6%9C%BA%E6%9E%84
    // https://reading.udn.com/udnlib/ntust/booksearch?sort=all&opt=publishtime&kw=2023
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
