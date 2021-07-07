#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform University of Chicago Journals
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

  let match;

  if (/^\/action\/doSearch$/i.test(path)) {
    // http://www.journals.uchicago.edu:80/action/doSearch?SeriesKey=aft&AllField=picasso
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  } else if ((match = /^\/doi\/full\/(10\.[0-9]+\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/full/10.1086/676545
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.doi    = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/doi\/pdfplus\/(10\.[0-9]+\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/pdfplus/10.1086/449144
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDFPLUS';
    result.doi    = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/doi\/abs\/(10\.[0-9]+\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/abs/10.1086/449146
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.doi    = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/toc\/[a-z]*\/([0-9]*)\/([0-9]*)\//i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/toc/aft/2017/44/+
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.publication_date = match[1];
    result.issue    = match[2];
  } else if ((match = /^\/doi\/(([0-9.]*)\/([0-9]*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/10.1086/693954
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.doi    = match[1];
    result.unitid = match[3];
  } else if ((match = /^\/toc\/[a-z]*\/([a-z]*)$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/toc/aje/current
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.issue = match[1];
  } else if (/^\/journals\/[a-z]*\/received$/i.test(path)) {
    // http://www.journals.uchicago.edu:80/journals/rq/received
    result.rtype = 'TOC';
    result.mime  = 'HTML';
  } else if (/^\/loi\/[a-z]*$/i.test(path)) {
    // http://www.journals.uchicago.edu:80/loi/jacr
    result.rtype = 'TOC';
    result.mime  = 'HTML';
  } else if ((match = /^\/pb-assets\/docs\/journals\/[a-z]*-books-recd\/(.*)\.pdf$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/pb-assets/docs/journals/rq-books-recd/RQ-books-received-70-3.pdf
    result.rtype  = 'REF';
    result.mime   = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/doi\/citedby\/(10\.[0-9]+\/(.*))$/i.exec(path)) !== null) {
    // http://www.journals.uchicago.edu:80/doi/citedby/10.1086/693161
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.doi    = match[1];
    result.unitid = match[2];
  } else if ((match = /^\/doi\/pdf\/(10\.[0-9]+\/(.*))$/i.exec(path)) !== null) {
    // /doi/pdf/10.1086/449144
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.doi    = match[1];
    result.unitid = match[2];
  }

  return result;
});
