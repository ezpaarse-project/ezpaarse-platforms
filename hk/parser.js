#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Human Kinetics
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

  let match;

  if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/(article-p([0-9]+))\.xml$/i.exec(path)) !== null && param.content == 'pdf') {
    // https://journals.humankinetics.com/view/journals/japa/30/5/article-p761.xml?content=pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.spage = match[5];
    result.unitid = match[4];
  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/(article-p([0-9]+))\.xml$/i.exec(path)) !== null) {
    // https://journals.humankinetics.com/view/journals/japa/30/5/article-p761.xml
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.spage = match[5];
    result.unitid = match[4];
  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/(([a-z+]+).([0-9-]+).issue-([0-9-]+))\.xml$/i.exec(path)) !== null) {
    // https://journals.humankinetics.com/view/journals/apaq/38/4/apaq.38.issue-4.xml
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.unitid = match[4];
  } else if ((match = /^\/view\/journals\/([a-z]+)\/(([a-z]+)-overview)\.xml$/i.exec(path)) !== null) {
    // https://journals.humankinetics.com/view/journals/apaq/apaq-overview.xml
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/view\/journals\/([a-z]+)\/([a-z]+)\/article-([a-z0-9.-]+)\/([a-z0-9.-]+)\.xml$/i.exec(path)) !== null) {
    // https://journals.humankinetics.com/view/journals/krj/aop/article-10.1123-kr.2022-0018/article-10.1123-kr.2022-0018.xml?rskey=qLCrSF&result=2
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[4];
    result.doi = match[3];
  } else if ((match = /^\/products\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://us.humankinetics.com/products/Brain-Compatible-Dance-Education-Web-Resource-2nd-Edition?
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/search-old$/i.test(path)) {
    // https://www.humankinetics.com/search-old?Q=brain&x=0&y=0#&sSearchWord=brain
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
