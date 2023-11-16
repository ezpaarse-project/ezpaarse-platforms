#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bristol University Press Digital
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

  if ((match = /^\/display\/book\/(([0-9]+)\/ch[0-9]+\.xml)$/i.exec(path)) !== null && param.tab_body == 'pdf') {
    // https://bristoluniversitypressdigital.com/display/book/9781447370611/ch001.xml?tab_body=pdf
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.online_identifier = match[2];
    result.unitid = match[1] + parsedUrl.search;
  } else if ((match = /^\/view\/journals\/([a-z]+\/([0-9]+)\/([0-9]+)\/article-p([0-9]+)\.xml)$/i.exec(path)) !== null && param.tab_body == 'pdf') {
    // https://bristoluniversitypressdigital.com/view/journals/evp/19/1/article-p3.xml?tab_body=pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.vol = match[2];
    result.issue = match[3];
    result.first_page = match[4];
    result.unitid   = match[1] + parsedUrl.search;
  } else if ((match = /^\/display\/book\/(([0-9]+)\/ch[0-9]+\.xml)$/i.exec(path)) !== null) {
    // https://bristoluniversitypressdigital.com/display/book/9781447370611/ch001.xml
    // https://bristoluniversitypressdigital.com/display/book/9781447370611/ch002.xml?tab_body=abstract
    if (param.tab_body == 'abstract') {
      result.rtype    = 'ABS';
    } else {
      result.rtype    = 'BOOK_SECTION';
    }
    result.mime     = 'HTML';
    result.online_identifier = match[2];
    if (parsedUrl.search) {
      result.unitid = match[1] + parsedUrl.search;
    } else {
      result.unitid = match[1];
    }
  } else if ((match = /^\/view\/journals\/([a-z]+\/([0-9]+)\/([0-9]+)\/article-p([0-9]+)\.xml)$/i.exec(path)) !== null) {
    // https://bristoluniversitypressdigital.com/view/journals/consoc/2/2/article-p182.xml
    // https://bristoluniversitypressdigital.com/view/journals/evp/19/1/article-p3.xml
    // https://bristoluniversitypressdigital.com/view/journals/consoc/2/2/article-p182.xml?tab_body=abstract
    if (param.tab_body == 'abstract') {
      result.rtype    = 'ABS';
    } else {
      result.rtype    = 'ARTICLE';
    }
    result.mime     = 'HTML';
    result.vol = match[2];
    result.issue = match[3];
    result.first_page = match[4];
    if (parsedUrl.search) {
      result.unitid = match[1] + parsedUrl.search;
    } else {
      result.unitid = match[1];
    }
  } else if ((match = /^\/display\/book\/([0-9]+)\/([0-9]+)\.xml$/i.exec(path)) !== null) {
    //https://bristoluniversitypressdigital.com/display/book/9781447370611/9781447370611.xml?rskey=HqKDad&result=3
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.online_identifier = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/view\/journals\/([a-z]+\/([0-9]+)\/([0-9]+)\/[a-z]+\.[0-9]+\.issue-[0-9]+\.xml)$/i.exec(path)) !== null) {
    // https://bristoluniversitypressdigital.com/view/journals/evp/19/1/evp.19.issue-1.xml
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.vol = match[2];
    result.issue = match[3];
    result.unitid   = match[1];
  } else if ((match = /^\/view\/journals\/([a-z]+)\/([a-z]+)-overview\.xml$/i.exec(path)) !== null) {
    // https://bristoluniversitypressdigital.com/view/journals/consoc/consoc-overview.xml?tab_body=toc
    // https://bristoluniversitypressdigital.com/view/journals/evp/evp-overview.xml?tab_body=toc
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/search$/i.test(path)) {
    // https://bristoluniversitypressdigital.com/search?q1=Social&searchBtn=
    // https://bristoluniversitypressdigital.com/search?q1=Social&pageSize=10&sort=relevance&q2=Social+Policies&searchWithinSubmit=&t1=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
