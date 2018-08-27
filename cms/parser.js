#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chicago Manual of Style
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

  if ((match = /^\/book\/((.*)\/(.*)\/(.*)\/psec(.*)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/book/ed17/part1/ch02/psec004.html
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid = match[1];
  } else if ((match = /^\/book\/((.*)\/backmatter\/glos).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/book/ed17/backmatter/glos.html
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/book\/((.*)\/(.*)\/(.*)\/tables\/tbl(.*)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/book/ed17/part2/ch09/tables/tbl001.html
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/book\/((.*)\/frontmatter\/(.*)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org.proxy.library.emory.edu/book/ed17/frontmatter/toc.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/book\/((.*)\/backmatter\/biblio\/toc).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/book/ed17/backmatter/biblio/toc.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/book\/((.*?)\/.*toc).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/book/ed17/part1/ch02/toc.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/((qanda)\/topicList)$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/qanda/topicList
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/search.html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/search.html?clause=abbreviations
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/(tools_citationguide).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/tools_citationguide.html
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/((tools_citationguide)\/(.*)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/tools_citationguide/citation-guide-2.html
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/((qanda)\/(latest)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/qanda/latest.html
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/((qanda)\/(.*)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/qanda/data/faq/topics/LessorFewer.html
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/((help-tools)\/(.*)).html$/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/help-tools/my-manual/notes.html
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/book\/((.*)\/(.*)\/(index))/i.exec(path)) !== null) {
    // http://www.chicagomanualofstyle.org:80/book/ed17/backmatter/index/a.html
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
