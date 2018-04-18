#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bates Visual Guide To Physical Examination
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

  if ((match = /^\/data\/multimedia\/(.*).pdf$/i.exec(path)) !== null) {
    // http://batesvisualguide.com:80/data/multimedia/lww_bates_osce3_sorethroat_transcript_final.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/DocumentLibrary\/Bates\/(.*).pdf$/i.exec(path)) !== null) {
    // http://batesvisualguide.com:80/DocumentLibrary/Bates/BatesVideoPersistentUrls.pdf
    result.rtype    = 'TOC';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if (/^\/multimedia.aspx$/i.test(path)) {
    // http://batesvisualguide.com:80/multimedia.aspx?categoryId=21787
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.categoryId;
  } else if (/^\/MultiMediaPlayer.aspx$/i.test(path)) {
    // http://batesvisualguide.com:80/MultimediaPlayer.aspx?multimediaid=6091076
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = param.multimediaid;
    result.unitid   = param.multimediaid;
  } else if (/^\/searchresults/i.test(path)) {
    // http://batesvisualguide.com:80/searchresults.aspx
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
