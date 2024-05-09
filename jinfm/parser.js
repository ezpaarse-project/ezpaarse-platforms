#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Jinfm
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/channel\/([0-9]+)$/i.exec(path)) !== null) {
    // https://jinfm.udn.com/channel/409
    // https://jinfm.udn.com/channel/34
    // https://jinfm.net/channel/1234
    // https://jinfm.net/channel/1243
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.unitid = match[1];

  } else if (/^\/search$/i.test(path) && param.q !== undefined) {
    // https://jinfm.net/search?q=神準天王傳授當沖交易金丹、多空市場判讀祕技與操盤技巧&page=1&sortby=1
    // https://jinfm.net/search?q=上帝&page=1&sortby=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
