#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NII-REO
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

  if ((match = /^\/hss\/([0-9]+)\/fulltext\/[a-z]{2}$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/hss/2000000000215788/fulltext/ja
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/hss\/([0-9]+)\/[a-z]{2}$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/hss/2200000000667829/ja
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/oja\/ART([0-9]+)\/?([a-z]{2})?$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/oja/ART1000061051/en
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = `ART${match[1]}`;
  } else if (/^\/hss\/searchresult$/i.test(path)) {
    // https://reo.nii.ac.jp/hss/searchresult
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/oja\/advance$/i.test(path)) {
    // https://reo.nii.ac.jp/oja/advance
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/oja\/HtmlIndicate\/html\/vol_issues\/SUP0000002000\/JOU([0-9]+)\/vol_issue_list(_en)?.html$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/oja/HtmlIndicate/html/vol_issues/SUP0000002000/JOU0002000011/vol_issue_list_en.html
    // https://reo.nii.ac.jp/oja/HtmlIndicate/html/vol_issues/SUP0000002000/JOU0002000014/vol_issue_list_en.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = `JOU${match[1]}`;
  } else if ((match = /^\/oja\/HtmlIndicate\/Contents\/SUP0000002000\/JOU([0-9]+)\/ISS([0-9]+)\/ART([0-9]+)\/ART([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://reo.nii.ac.jp/oja/HtmlIndicate/Contents/SUP0000002000/JOU0002000014/ISS0010000855/ART1000067239/ART1000067239.pdf
    // https://reo.nii.ac.jp/oja/HtmlIndicate/Contents/SUP0000002000/JOU0000000000/ISS1010000366/ART1000036996/ART1000036996.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = `ART${match[3]}`;
  }

  return result;
});
