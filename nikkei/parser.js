#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nikkei
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

  if (/^\/g3\/[a-z0-9]+\.do$/i.test(path) && param.keyPdf) {
    // https://t21.nikkei.co.jp/g3/ATCD017.do?keyPdf=NIKPRLRSP634391_15062022%5CPRL%5C%5C%5C%5C001%5C808%5CY%5C%5C%40ENC%4046d423655e58e9f01784a44e718eb4a1b8b5afb851c537174813021b64021b852ca6cae45efa32e6f32a639867b860e8f78bd7567f72cdd41f339763b045da7e55815a3ceb0ebf6e7b15c2c09387c59953fcb2e4c264774cba02407828e48b2c0b902882d119f587af49efd659fdad1cd8c397d75abcb193c5d434486cd512a1%5CPDF%5C20220615%5C590405e6&analysisIdentifer=fromSearchArt&analysisPrevActionId=ATCD012
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = param.keyPdf.split('\\')[0];

  } else if ((match = /^\/g3\/([a-z0-9]+)\.do$/i.exec(path)) !== null) {
    // https://t21.nikkei.co.jp/g3/CRPD071.do?analysisIdentifer=&analysisPrevActionId=CMNUF11
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
