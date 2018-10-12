#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform STAT!Ref
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

  if (/(Document|DocumentContent|BookTitle).aspx$/i.test(path)) {
    // http://online.statref.com:80/Document.aspx?docAddress=SaoWxNG8S1byvtPckclkVw!!&SessionId=2A3CA04RKSRWLWKO
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.docAddress;
  } else if (/^\/Media.aspx$/i.test(path)) {
    // http://online.statref.com:80/Media.aspx?SessionID=2A3CA04RKSRWLWKO&Title=ACPM&Media=PDF/1014.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.Media;
    result.unitid   = /PDF\/([0-9]+).pdf/i.exec(param.Media)[1];
  } else if (/^\/Results.aspx$/i.test(path)) {
    // http://online.statref.com:80/Results.aspx?SessionID=2A3CA04RKSRWLWKO&query=potato
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/SplashContent\/(.*).pdf$/i.exec(path)) !== null) {
    // http://online.statref.com:80/SplashContent/druginfoline_9_2018_min.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
