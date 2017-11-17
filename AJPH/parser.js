#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Public Health Association
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.path;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/action\/recommendation\?doi=(.*?)\/(.*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/action/recommendation?doi=10.2105/9780875530024
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.doi = match[1] + '/' + match[2];
    result.print_identifier = match[2];
  } else if ((match = /^\/doi\/abs\/(.*?)\/([A-Z].*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/abs/10.2105/AJPH.2012.301107
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1] + '/' + match[2];
    result.unitid = match[2];
  } else if ((match = /^\/doi\/abs\/(.*?)\/([0-9]+)/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/abs/10.2105/9780875530024fm01
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1] + '/' + match[2];
    result.print_identifier = match[2];
  } else if ((match = /^\/doi\/pdf\/(.*?)\/(.*?)fm01$/.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/pdf/10.2105/9780875530024fm01
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.doi      = match[1] + '/' + match[2];
    result.print_identifier = match[2];
  } else if ((match = /^\/doi\/book\/(.*?)\/(.*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/book/10.2105/9780875530024
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.doi      = match[1] + '/' + match[2];
    result.print_identifier = match[2];
  } else if ((match = /^\/doi\/full\/(.*?)\/(.*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/full/10.2105/AJPH.2012.301107
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = match[1] + '/' + match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doi\/pdf\/(.*?)\/([A-Z].*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/pdf/10.2105/AJPH.2012.301107
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = match[1] + '/' + match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doi\/pdfplus\/(.*?)\/(.*?)fm01$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/pdfplus/10.2105/9780875530024fm01
    result.rtype    = 'BOOK';
    result.mime     = 'PDFPLUS';
    result.doi      = match[1] + '/' + match[2];
    result.print_identifier = match[2];
  } else if ((match = /^\/doi\/pdfplus\/(.*?)\/([A-Z].*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/pdfplus/10.2105/AJPH.2012.301107
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDFPLUS';
    result.doi      = match[1] + '/' + match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doi\/ref\/(.*?)\/([A-Z].*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/ref/10.2105/AJPH.2012.301107
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.doi      = match[1] + '/' + match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doi\/suppl\/(.*?)\/([A-Z].*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/suppl/10.2105/AJPH.2017.303839
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.doi      = match[1] + '/' + match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/doi\/(.*?)\/(.*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/doi/10.2105/AJPH.2017.303839
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.doi = match[1] + '/' + match[2];
    result.unitid   = match[2];
  } else if ((match = /^\/pb-assets\/podcasts\/(.*)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/pb-assets/podcasts/2017-10_Chinese.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if ((match = /^\/toc\/ajph\/(.*)/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/toc/ajph/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/topic\/([a-z]+)$/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/topic/drugs
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /\/doSearch/i.exec(path)) !== null) {
    // http://ajph.aphapublications.org:80/action/doSearch?AllField=cancer
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
