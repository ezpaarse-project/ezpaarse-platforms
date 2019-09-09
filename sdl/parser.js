#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SPIE Digital Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // console.error(parsedUrl);

  let match;

  if ((match = /^\/(journalArticle|proceedings)\/Download$/i.exec(path)) !== null) {
    // /journalArticle/Download?fullDOI=10.1117%2F1.JEI.24.5.051006
    // /proceedings/Download?fullDOI=10.1117%2F12.2242951
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.doi      = param.fullDOI;
    const unitidTmp = param.fullDOI.match(/^([0-9.]+)\/([a-z0-9.]+)$/i);
    if (unitidTmp) {
      result.unitid   = unitidTmp[2];
    }
  } else if ((match = /^\/journals\/([a-z0-9-]+)\/volume-([0-9]+)\/issue-([0-9]+)(\/[0-9]+\/[a-z-]+\/([0-9.]+)\/([a-z0-9.]+)\.full)?$/i.exec(path)) !== null) {
    // /journals/journal-of-electronic-imaging/volume-24/issue-05
    // /journals/Journal-of-Electronic-Imaging/volume-24/issue-05/051006/How-much-image-noise-can-be-added-in-cardiac-x/10.1117/1.JEI.24.5.051006.full
    result.vol      = match[2];
    result.issue    = match[3];
    result.unitid   = `${match[1]}/volume-${match[2]}/issue-${match[3]}`;
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

    if (match[4]) {
      result.doi      = `${match[5]}/${match[6]}`;
      result.unitid   = match[6];
      result.rtype    = 'ARTICLE';
    }
  } else if ((match = /^\/conference-proceedings-of-spie\/[0-9]+\/[a-z0-9]+\/[a-z0-9-]+\/([0-9.]+)\/([0-9.]+)\.full$/i.exec(path)) !== null) {
    // /conference-proceedings-of-spie/10013/100130K/High-speed-multiphoton-imaging/10.1117/12.2242951.full
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = `${match[1]}/${match[2]}`;
    result.unitid   = match[2];
  }

  return result;
});
