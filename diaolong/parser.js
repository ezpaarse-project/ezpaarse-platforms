#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Diaolong
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

  if ((match = /^\/[a-z]+\/home\/readPage\/([a-z0-9]+)\/[0-9]+\/index\.do$/i.exec(path)) !== null) {
    // https://www.diaolong.jp/wenxinge/home/readPage/C430521B8F114B75AA48321D9E2E24D1/1/index.do?ytzFlag=Y&heightWord=%25E6%25BA%25BA%25E5%25A5%25B3
    // https://www.diaolong.jp/wenxinge/home/readPage/58CE034D81544A3A89DD9CFD6D9EC7EA/1/index.do?ytzFlag=Y&heightWord=%25E6%25BA%25BA%25E5%25A5%25B3
    // https://www.diaolong.jp/wenxinge/home/readPage/70CB713BB15D4EF280D01A18A4713320/1/index.do?ytzFlag=Y
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if (/^\/[a-z]+\/home\/doc\/index\.do$/i.test(path)) {
    // https://www.diaolong.jp/wenxinge/home/doc/index.do
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
