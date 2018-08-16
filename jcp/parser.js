#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const jcp_doi_prefix = '10.4088/JCP.';
const pcc_doi_prefix = '10.4088/PCC.';

/**
 * Recognizes the accesses to the platform Journal of Clinical Psychiatry
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
  let itemid;

  if ((match = /^\/([a-zA-Z]{3})\/article\/_layouts\/ppp\.psych\.controls\/BinaryViewer\.ashx$/i.exec(path)) !== null) {
    // http://www.psychiatrist.com:80/JCP/article/_layouts/ppp.psych.controls/BinaryViewer.ashx?Article=/JCP/article/Pages/2018/v79n02/17m11587.aspx&Type=Article
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if ((itemid = /^\/.*\/(.*)\.aspx$/i.exec(param.Article)) !== null) {
      result.unitid = itemid[1];
    } if (match[1] === 'JCP' || match[1] === 'jcp') {
      result.doi = jcp_doi_prefix + itemid[1];
    } else if (match[1] === 'PCC' || match[1] === 'pcc') {
      result.doi = pcc_doi_prefix + itemid[1];
    }
  } else if ((match = /^\/([a-zA-Z]{3})\/article\/(Pages|pages)\/\d\d\d\d\/[a-z0-9]*\/(.*)\.aspx$/i.exec(path)) !== null) {
    // http://www.psychiatrist.com:80/JCP/article/Pages/2018/v79n02/17m11587.aspx
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[3];
    if (match[1] === 'jcp' || match[1] === 'JCP') {
      result.doi = jcp_doi_prefix + match[3];
    } else if (match[1] === 'pcc' || match[1] === 'PCC') {
      result.doi = pcc_doi_prefix + match[3];
    }
  } else if ((match = /^\/([a-zA-Z]{3})\/article\/binaryfiles\/audio\/player.aspx$/i.exec(path)) !== null) {
    // http://www.psychiatrist.com:80/jcp/article/binaryfiles/audio/player.aspx?grant=hi&url=/pcc/article/BinaryFiles/audio/podcast/40PCC196PC.mp3&title=The%20Primary%20Care%20Companion&author=Various%20Authors&duration=
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    if ((itemid = /^\/([a-zA-Z]{3})\/.*\/(.*).mp3$/i.exec(param.url)) !== null) {
      result.unitid = itemid[2];
    } if (match[1] === 'jcp' || match[1] === 'JCP') {
      result.publication_title = 'The Journal of Clinical Psychiatry';
    } else if (match[1] === 'pcc' || match[1] === 'PCC') {
      result.pulication_title = 'The Primary Care Companion For CNS Disorders';
    }
  } else if ((match = /^\/([a-zA-Z]{3})\/article\/BinaryFiles\/audio\/podcast\/(.*).mp3$/i.exec(path)) !== null) {
    // http://www.psychiatrist.com:80/pcc/article/BinaryFiles/audio/podcast/20PCC164PC.mp3
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[2];
    if (match[1] === 'jcp' || match[1] === 'JCP') {
      result.publication_title = 'The Journal of Clinical Psychiatry';
    } else if (match[1] === 'pcc' || match[1] === 'PCC') {
      result.publication_title = 'The Primary Care Companion For CNS Disorders';
    }
  } else if ((match = /^\/([a-zA-Z]{3})\/toc|TOC\/pages\/.*.aspx$/i.exec(path)) !== null) {
    // http://www.psychiatrist.com:80/jcp/toc/pages/aheadofprint.aspx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (match[1] === 'jcp' || match[1] === 'JCP') {
      result.publication_title = 'The Journal of Clinical Psychiatry';
    } else if (match[1] === 'pcc' || match[1] === 'PCC') {
      result.publication_title = 'The Primary Care Companion For CNS Disorders';
    }
  } else if ((match = /^\/([a-zA-Z]{3})\/Pages|pages\/weekly.aspx$/i.exec(path)) !== null) {
    // http://www-psychiatrist-com.proxy.library.emory.edu/JCP/Pages/weekly.aspx
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    if (match[1] === 'jcp' || match[1] === 'JCP') {
      result.publication_title = 'The Journal of Clinical Psychiatry';
    } else if (match[1] === 'pcc' || match[1] === 'PCC') {
      result.publication_title = 'The Primary Care Companion For CNS Disorders';
    }
  } else if (/^\/(Pages|pages)\/Search/i.test(path)) {
    // http://www.psychiatrist.com:80/Pages/SearchResults.aspx?k=%22freud%22
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/[a-z]{3}\/Pages|pages\/categories.aspx$/i.test(path)) {
    // http://www.psychiatrist.com:80/pcc/pages/categories.aspx?cat=Sleep
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
