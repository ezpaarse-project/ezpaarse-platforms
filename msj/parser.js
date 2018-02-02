#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Microbiology Society Journals
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

  if (/^\/deliver\/fulltext\/([a-z]*)\/.*?\/(.*)\.[a-z]*$/i.test(path)) {
    // http://mic.microbiologyresearch.org:80/deliver/fulltext/micro/micro.000612.zip/mic000612.pdf?itemId=/content/journal/micro/10.1099/mic.0.000612.v1&mimeType=pdf&isFastTrackArticle=true
    // http://jgv.microbiologyresearch.org:80/deliver/fulltext/jgv/jgv.001012.zip/jgv001012.html?itemId=/content/journal/jgv/10.1099/jgv.0.001012.v1&mimeType=html&fmt=ahah
    // http://mgen.microbiologyresearch.org:80/deliver/fulltext/mgen/mgen.000150.zip/000150_1.pdf?itemId=/content/suppdata/mgen/10.1099/mgen.0.000150.v1-1&mimeType=pdf&isFastTrackArticle=
    result.mime     = param.mimeType.toUpperCase();
    if ((itemid = /^\/content\/([a-z]*)\/[a-z]*\/((.*?)\/(.*))\.v/i.exec(param.itemId)) !== null) {
      result.doi    = itemid[2];
      result.unitid = itemid[4];
      if (itemid[1] === 'journal') {
        result.rtype = 'ARTICLE';
      } else if (itemid[1] === 'suppdata') {
        result.rtype = 'SUPPL';
      }
    } else if ((itemid = /^\/content\/([a-z]*)\/[a-z]*\/((.*?)\/([a-z0-9.-]*))/i.exec(param.itemId)) !== null) {
      result.doi    = itemid[2];
      result.unitid = itemid[4];
      if (itemid[1] === 'journal') {
        result.rtype = 'ARTICLE';
      } else if (itemid[1] === 'suppdata') {
        result.rtype = 'SUPPL';
      }
    }
  } else if ((match = /^\/content\/journal\/[a-z]*\/((.*)\/([a-z]*\.[0-9]*\.[0-9]*))$/i.exec(path)) !== null) {
    // http://jgv.microbiologyresearch.org:80/content/journal/jgv/10.1099/jgv.0.001012
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if ((match = /^\/content\/journal\/[a-z]*\/((.*)\/(.*))\..*?\/figures$/i.exec(path)) !== null) {
    // http://jgv.microbiologyresearch.org:80/content/journal/jgv/10.1099/jgv.0.001012.v1/figures?fmt=ahah
    result.rtype    = 'FIGURE';
    result.mime     = 'HTML';
    result.doi      = match[1];
    result.unitid   = match[3];
  } else if (/^\/metrics\/usage\.action$/i.test(path)) {
    // http://jmm.microbiologyresearch.org:80/metrics/usage.action?startDate=2017-11-29&endDate=2018-01-26&itemId=/content/journal/jmm/10.1099/jmm.0.000636
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if ((itemid = /^\/content\/journal\/[a-z]*\/((.*?)\/(.*))$/i.exec(param.itemId)) !== null) {
      result.doi      = itemid[1];
      result.unitid   = itemid[3];
    }
  } else if (/^\/references\/matchedRefsForItem\.action$/i.test(path)) {
    // http://jmm.microbiologyresearch.org:80/references/matchedRefsForItem.action?itemId=/content/journal/jmm/10.1099/jmm.0.000682.v1
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if ((itemid = /^\/content\/journal\/[a-z]*\/((.*?)\/(.*))\.v[0-9]$/i.exec(param.itemId)) !== null) {
      result.doi    = itemid[1];
      result.unitid = itemid[3];
    }
  } else if (/^\/search$/i.test(path)) {
    // http://jmm.microbiologyresearch.org:80/search?value1=virus&option1=all&option2=pub_serialIdent&value2=&operator2=AND
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
