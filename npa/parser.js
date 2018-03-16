#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Newspaper Archive
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

  if ((match = /^\/tags\/$/i.exec(path)) !== null) {
    // https://access.newspaperarchive.com:443/tags/?pf=david&pl=hamlett&psb=dateasc
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/[a-z]{2}\/[a-z-]*\/[a-z-]*\/(([a-z-]*)\/([0-9]{4})\/(([0-9]{2})-([0-9]{2}).*))/i.exec(path)) !== null) {
    // https://access.newspaperarchive.com:443/us/tennessee/knoxville/knoxville-knoxville-journal/1855/10-01
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_date = match[3];
    result.publication_title = match[2];
    result.unitid   = match[1];
    result.vol      = match[5];
    result.issue    = match[6];
  } else if ((match = /^\/[a-z]{2}\/[a-z]*\/[a-z]*\/([a-z-]*)/i.exec(path)) !== null) {
    // https://access.newspaperarchive.com:443/de/hesse/darmstadt/european-stars-and-stripes
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.publication_title = match[1];
  } else if ((match = /^\/IIPViewerWeb\/webresources\/pdfdownload\/([0-9]*)$/i.exec(path)) !== null) {
    // https://pdftojp2.newspaperarchive.com:443/IIPViewerWeb/webresources/pdfdownload/116109837
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
