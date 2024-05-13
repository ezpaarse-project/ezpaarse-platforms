#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DBpia
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

  if ((match = /^\/api\/pdf\/detail\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.dbpia.co.kr/api/pdf/detail/NODE11699924
    // https://www.dbpia.co.kr/api/pdf/detail/NODE11556611
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if (/^\/journal\/articleDetail$/i.test(path) && param.nodeId !== undefined) {
    // https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11699924
    // https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11556611
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.nodeId;
  } else if (/^\/search\/topSearch$/i.test(path)) {
    // https://www.dbpia.co.kr/search/topSearch?searchOption=all&query=이
    // https://www.dbpia.co.kr/search/topSearch?searchOption=all&query=버추얼 아이돌 특성이 버추얼 아이돌 공연 수용자 태도에 미치는 영향
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
