#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nature Asia
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

  if ((match = /^\/original\/magazine-assets\/[a-z0-9-]+\/([a-z0-9-]+)\.pdf$/i.exec(path)) !== null) {
    // https://media.nature.com/original/magazine-assets/d41586-023-00656-3/d41586-023-00656-3.pdf
    // https://media.nature.com/original/magazine-assets/d41586-023-00659-0/d41586-023-00659-0.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/articles\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.nature.com/articles/d41586-023-00656-3
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z]+\/[a-z-]+\/[a-z]+\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.natureasia.com/en/phys-sci/research/11754
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/[a-z-]+\/volumes$/i.test(path)) {
    // https://www.nature.com/nature/volumes
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/nature\/volumes\/(([0-9]+)\/issues\/([0-9]+))$/i.exec(path)) !== null) {
    // https://www.nature.com/nature/volumes/617/issues/7962
    // https://www.nature.com/nature/volumes/596/issues/7873
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.vol = match[2];
    result.issue = match[3];
  } else if ((match = /^\/articles\/([0-9a-z-]+)\/figures\/[0-9]+$/i.exec(path)) !== null) {
    // https://www.nature.com/articles/s41467-023-41754-0/figures/1
    result.rtype    = 'FIGURE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/original\/magazine-assets\/[0-9a-z-]+\/([0-9a-z-_]+)\.mpga$/i.exec(path)) !== null) {
    // https://media.nature.com/original/magazine-assets/d41586-023-03219-8/d41586-023-03219-8_26176150.mpga
    // https://media.nature.com/original/magazine-assets/d41586-023-02983-x/d41586-023-02983-x_26069426.mpga
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.unitid   = match[1];
  } else if ((match = /^\/springer-cms\/rest\/v1\/content\/([0-9]+)\/data\/v1$/i.exec(path)) !== null) {
    // http://resource-cms.springernature.com/springer-cms/rest/v1/content/26199018/data/v1
    result.rtype    = 'AUDIO';
    result.mime     = 'MP3';
    result.unitid   = match[1];
  } else if (/^\/search$/i.test(path)) {
    // https://www.nature.com/search?q=protein&journal=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
