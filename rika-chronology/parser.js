#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Rika Chronology- Premium
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

  if (/^\/member\/?$/i.test(path)) {
    
    if (param.page) {
    // http://www.rikanenpyo.jp/member/?module=Member&p=Contents%26page%3DMS1catC%3AC%5EContents%26page%3D1_cMEx1100031_1999_1%3Aco&action=Contents&page=1_cMEx1100031_1999_1
    // http://www.rikanenpyo.jp/?module=Member&action=Contents&page=allCAx11x0250_2022_1.html    
       result.rtype    = 'TABLE';
       result.mime     = 'HTML';      
    } else {
    // http://www.rikanenpyo.jp/member/?module=Member&action=MS1
    // http://www.rikanenpyo.jp/?module=Member&action=Contents&page=MS1catC        
       result.rtype    = 'TOC';
       result.mime     = 'HTML';    
    }
  }

  return result;
});
