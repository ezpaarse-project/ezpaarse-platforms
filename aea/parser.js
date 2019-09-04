#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Economic Association
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

  if (/^\/search|journals\/search-results/i.test(path)) {
    // https://www.aeaweb.org:443/search?q=barton
    // https://www.aeaweb.org:443/search?jelCode=A12&type=Articles&q=economy
    // https://www.aeaweb.org:443/journals/search-results?within%5Btitle%5D=on&within%5Babstract%5D=on&within%5Bauthor%5D=on&journal=&from=a&q=thomas
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/articles/i.test(path)) {
    // https://www.aeaweb.org:443/articles?id=10.1257/aer.101.7.3368
    // https://www.aeaweb.org:443/articles?id=10.1257/aer.20170973
    // https://www.aeaweb.org:443/articles?id=10.1257/jel.45.1.83&within%5Btitle%5D=on&within%5Babstract%5D=on&within%5Bauthor%5D=on&journal=&from=a&q=thomas&from=j
    // https://www.aeaweb.org:443/articles?id=10.1257/aer.20180888&&from=f
    // https://www.aeaweb.org:443/articles?id=10.1257/jep.33.3.3
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = param.id;
    result.title_id = param.id;
    result.doi = param.id;

  } else if ((match = /^\/issues\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.aeaweb.org:443/issues/558
    // https://www.aeaweb.org:443/issues/508
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/doi\/pdfplus\/([0-9.]{7})\/([0-z.]+)$/i.exec(path)) !== null) {
    // https://pubs.aeaweb.org:443/doi/pdfplus/10.1257/aer.101.7.3368
    // https://pubs.aeaweb.org:443/doi/pdfplus/10.1257/aer.20170973
    // https://pubs.aeaweb.org:443/doi/pdfplus/10.1257/jep.33.3.3
    result.rtype = 'ARTICLE';
    result.mime = 'PDFPLUS';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[1] + '/' + match[2];
    result.doi = match[1] + '/' + match[2];

  } else if ((match = /^\/research\/charts\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.aeaweb.org:443/research/charts/rising-income-inequality-china-us
    // https://www.aeaweb.org:443/research/charts/kidney-donor-paid-repugnant-transaction
    result.rtype = 'DATASET';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/asset-server\/articles-attachments\/([a-z]{3})\/data\/([0-z]+)\/([0-z_]+)\.pdf$/i.exec(path)) !== null) {
    // https://assets.aeaweb.org:443/asset-server/articles-attachments/aer/data/dec2011/20090781_app.pdf
    result.rtype = 'DATASET';
    result.mime = 'PDF';
    result.unitid = match[3];
    result.title_id = match[1] + '/' + match[2] + '/' + match[3];

  } else if ((match = /^\/asset-server\/files\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://assets.aeaweb.org:443/asset-server/files/10030.pdf
    result.rtype = 'DATASET';
    result.mime = 'PDF';
    result.unitid = match[1];

  } else if (/^\/full_issue.php/i.test(path)) {
    // https://www.aeaweb.org:443/full_issue.php?doi=10.1257/jep.33.3
    result.rtype = 'ARTICLES_BUNDLE';
    result.mime = 'PDF';
    result.unitid = param.doi;
    result.title_id = param.doi;
    result.doi = param.doi;

  } else if ((match = /^\/resources\/([a-z]+)\/([a-z]+)\/video\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.aeaweb.org:443/resources/students/careers/video/career-in-economics
    result.rtype = 'VIDEO';
    result.mime = 'HTML';
    result.unitid = match[3];
    result.title_id = match[3];

  }

  return result;
});
