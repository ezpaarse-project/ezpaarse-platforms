#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kaken
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/[a-z]+\/file\/[a-z0-9-]+\/([a-z0-9]+)\.pdf$/i.exec(path)) !== null) {
    // https://kaken.nii.ac.jp/en/file/KAKENHI-PROJECT-15K10014/15K10014seika.pdf
    result.rtype = 'REPORT';
    result.mime = 'PDF';
    result.unitid = match[1];

  } else if (/^\/[a-z]+\/[a-z]+\/download\/$/i.test(path)) {
    // https://nrid.nii.ac.jp/en/nrid/download/?rkey=90421825&mode=grants
    // https://nrid.nii.ac.jp/en/nrid/download/?rkey=20209399&mode=grants
    result.rtype = 'RECORD';
    result.mime = 'CSV';
    result.unitid = param.rkey;
  } else if ((match = /^\/[a-z]+\/[a-z]+\/([a-z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://nrid.nii.ac.jp/en/nrid/1000090421825/
    // https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-15H04637/
    result.rtype = 'RECORD';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/([a-z]+\/)?search\/$/i.test(path)) {
    // https://kaken.nii.ac.jp/search/?kw=physics
    // https://kaken.nii.ac.jp/en/search/?qm=90421825
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
