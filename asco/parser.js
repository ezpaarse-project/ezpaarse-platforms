#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Society of Clinical Oncology
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

  if ((match = /^\/doi\/full\/((.*?)\/(.*))$/i.exec(path)) !== null) {
    // http://ascopubs.org:80/doi/full/10.1200/JCO.2017.75.4721
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi   = match[1];
    result.unitid = match[3];
  } else if ((match = /^\/doi\/pdf\/((.*?)\/(.*))$/.exec(path)) !== null) {
    // http://ascopubs.org:80/doi/pdf/10.1200/JCO.2017.75.4721
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/abs\/((.*?)\/(.*))$/.exec(path)) !== null) {
    // http://ascopubs.org:80/doi/abs/10.1200/JOP.2017.025536
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/doi\/figure\/((.*?)\/(.*))$/.exec(path)) !== null) {
    // http://ascopubs.org:80/doi/figure/10.1200/JCO.2013.54.7893
    result.rtype    = 'FIGURE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /jobs\/(.*?)\//.exec(path)) !== null) {
    // https://careercenter-asco-org.proxytest.library.emory.edu/jobs/melanoma/
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  } else if ((match = /([A-Za-z]*?)\/site\/podcasts\//.exec(path)) !== null) {
    // http://ascopubs.org:80/jco/site/podcasts/index.xhtml
    result.rtype   = 'AUDIO';
    result.mime    = 'MISC';
    if (match[1] == 'jco') {
      result.publication_title = 'Journal of Clinical Oncology';
    } else if (match[1] == 'jop') {
      result.publication_title = 'Journal of Oncology Practice';
    }
  } else if ((match = /toc\/([a-z]*?)\//.exec(path)) !== null) {
    // http://ascopubs.org:80/toc/cci/1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (match[1] == 'jco') {
      result.publication_title = 'Journal of Clinical Oncology';
    } else if (match[1] == 'jop') {
      result.publication_title = 'Journal of Oncology Practice';
    } else if (match[1] == 'jgo') {
      result.publication_title = 'Journal of Global Oncology';
    } else if (match[1] == 'cci') {
      result.publication_title = 'Clinical Cancer Informatics';
    } else if (match[1] == 'po') {
      result.publication_title = 'Precision Oncology';
    }
  } else if ((match = /action\/doSearch/.exec(path)) !== null) {
    // http://ascopubs.org:80/action/doSearch?ConceptID=114&target=topic&SeriesKey=jco
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /jco\/(.*?)(podcast)/.exec(path)) !== null) {
    // http://ascopubs.org:80/jco/art-of-oncology-podcast
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1] + match[2];
    result.publication_title = 'Journal of Clinical Oncology';
  }

  if (/([A-Za-z]*?)\./.exec(result.unitid) !== null) {
    if (/([A-Za-z]*?)\./.exec(result.unitid)[1] == 'JCO') {
      result.publication_title = 'Journal of Clinical Oncology';
    } else if (/([A-Za-z]*?)\./.exec(result.unitid)[1] == 'JOP') {
      result.publication_title = 'Journal of Oncology Practice';
    } else if (/([A-Za-z]*?)\./.exec(result.unitid)[1] == 'JGO') {
      result.publication_title = 'Journal of Global Oncology';
    } else if (/([A-Za-z]*?)\./.exec(result.unitid)[1] == 'CCI') {
      result.publication_title = 'Clinical Cancer Informatics';
    } else if (/([A-Za-z]*?)\./.exec(result.unitid)[1] == 'PO') {
      result.publication_title = 'Precision Oncology';
    }
  }

  return result;
});
