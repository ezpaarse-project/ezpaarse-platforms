#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CWK
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  //let match;

  if (/^\/article\.php$/i.test(path)) {
    // https://new.cwk.com.tw/article.php?db=cw&id=40187&flag=1
    //  https://new.cwk.com.tw/article.php?db=cheers&id=11991&flag=1
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.db_id = param.db;
    result.unitid = param.id;

  } else if (/^\/result\.php$/i.test(path)) {
    // https://new.cwk.com/result.php
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
