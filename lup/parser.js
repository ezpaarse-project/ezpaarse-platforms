#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Liverpool University Press
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

  if ((match = /^\/doi\/book\/([0-9.]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www-liverpooluniversitypress-co-uk/doi/book/10.3828/9781786941725
    // https://www.liverpooluniversitypress.co.uk/doi/book/10.3828/9781789622508
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi = `${match[1]}/${match[2]}`;
    result.unitid = `${match[1]}/${match[2]}`;

  } else if ((match = /^\/journal\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.liverpooluniversitypress.co.uk/journal/bchs
    // https://www.liverpooluniversitypress.co.uk/journal/hgr
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/toc\/([a-zA-Z0-9]+)\/([0-9]+)\/([0-9-]+)$/i.exec(path)) !== null) {
    // https://www.liverpooluniversitypress.co.uk/toc/hgr/6/1-2
    // https://www.liverpooluniversitypress.co.uk/toc/hgr/5/3-4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.issue    = match[3];
    result.vol      = match[2];
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}`;
  } else if ((match = /^\/doi\/epdf\/([a-zA-Z0-9-./]+)$/i.exec(path)) !== null) {
    // https://www.liverpooluniversitypress.co.uk/doi/epdf/10.18647/600/JJS-1971
    // https://www.liverpooluniversitypress.co.uk/doi/epdf/10.3828/cfc.2009.4
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/doi\/([a-zA-Z0-9-./]+)$/i.exec(path)) !== null) {
    // https://www.liverpooluniversitypress.co.uk/doi/10.18647/600/JJS-1971
    // https://www.liverpooluniversitypress.co.uk/doi/10.3828/cfc.2009.4
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[1];
  } else if (/^\/action\/doSearch$/i.test(path)) {
    // https://www.liverpooluniversitypress.co.uk/action/doSearch?AllField=geomorphology
    // https://www.liverpooluniversitypress.co.uk/action/doSearch?AllField=Astrophysics
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
