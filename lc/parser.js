#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lyell Collection
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/content\/([a-z]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\.full\.pdf$/i.exec(path)) !== null) {
    // https://jm.lyellcollection.org/content/jmpaleo/36/2/153.full.pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.first_page = match[4];

  } else if ((match = /^\/content\/([0-9]+)\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://jm.lyellcollection.org/content/36/2/153
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.vol = match[1];
    result.issue = match[2];
    result.first_page = match[3];
  } else if (/^\/search\/(.+)$/i.test(path)) {
    // https://www.lyellcollection.org/search/rocks%20jcode%3Ageochem%7C%7Cegsp%7C%7Cmemoirs%7C%7Cspecpubgsl%7C%7Cjgs%7C%7Cjgsleg%7C%7Cjmpaleo%7C%7Cpgc%7C%7Cpetgeo%7C%7Cpygs%7C%7Cqjegh%7C%7Csjg%7C%7Ctransed%7C%7Ctransglas%7C%7Ctransgsl
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/doi\/(10\.[0-9]+\/([a-z0-9-]+))$/i.exec(path)) !== null) {
    // /doi/10.1144/jmpaleo2016-001
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';

    result.doi = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/doi\/([a-z]+)\/(10\.[0-9]+\/([a-z0-9-]+))$/i.exec(path)) !== null) {
    // /doi/epdf/10.1144/jmpaleo2016-001
    // /doi/epub/10.1144/jmpaleo2016-001

    switch (match[1]) {
    case 'epub':
      result.rtype = 'ARTICLE';
      result.mime = 'EPUB';
      break;
    case 'abstract':
      result.rtype = 'ABS';
      result.mime = 'HTML';
      break;
    case 'issuetoc':
      result.rtype = 'TOC';
      result.mime = 'MISC';
      break;
    case 'pdf':
    case 'epdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;
    }

    result.doi = match[2];
    result.unitid = match[3];
  } else if ((match = /^\/toc\/([a-z]+\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // https://www.lyellcollection.org/toc/geea/23/2
    // https://www.lyellcollection.org/toc/geoenergy/1/1
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.vol = match[2];
    result.issue = match[3];
  } else if ((match = /^\/journal\/loi\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.lyellcollection.org/journal/loi/geoenergy
    // https://www.lyellcollection.org/journal/loi/geea
    result.rtype = 'TOC';
    result.mime = 'HTML';

    result.unitid = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://www.lyellcollection.org/action/doSearch?AllField=chemistry
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
