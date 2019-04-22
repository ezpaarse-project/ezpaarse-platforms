#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Vascular and Interventional Radiology
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

  if ((match = /^\/issue\/([a-zA-Z0-9-]+)([(])([0-9]+)([)])([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.jvir.org:443/issue/S1051-0443(16)X0004-8
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1] + match[2] + match[3] + match[4] + match[5];
  } else if ((match = /^\/article\/([a-zA-Z0-9-]+)([(])([0-9]+)([)])([a-zA-Z0-9-]+)\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.jvir.org:443/article/S1051-0443(16)30714-X/fulltext
    // https://www.jvir.org:443/article/S1051-0443(16)30714-X/pdf
    // https://www.jvir.org:443/article/S1051-0443(16)30566-8/addons
    if (match[6] == 'fulltext') {
      result.mime = 'HTML';
      result.rtype  = 'ARTICLE';
    }
    if (match[6] == 'pdf') {
      result.mime = 'PDF';
      result.rtype  = 'ARTICLE';
    }
    if (match[6] == 'addons') {
      result.mime = 'HTML';
      result.rtype = 'SUPPL';
    }
    result.unitid = match[1] + match[2] + match[3] + match[4] + match[5];
  } else if ((match = /^\/action\/([a-z]+)/i.exec(path)) !== null) {
    // https://www.jvir.org:443/action/showFullTextImages?pii=S1051-0443%2816%2930566-8
    // https://www.jvir.org:443/action/doSearchSecure?searchType=quick&searchText=potato&occurrences=all&journalCode=jvir&searchScope=fullSite
    // https://www.jvir.org:443/action/doSearch?occurrences=all&searchText=brain&searchType=quick&searchScope=fullSite&journalCode=jvir
    if (match[1] == 'showFullTextImages') {
      result.rtype = 'SUPPL';
    }
    if (match[1] == 'doSearchSecure') {
      result.rtype = 'SEARCH';
    }
    if (match[1] == 'doSearch') {
      result.rtype = 'SEARCH';
    }
    result.mime = 'HTML';
    result.unitid = param.pii;
  } else if ((match = /^\/content\/([a-z]+)/i.exec(path)) !== null) {
    // https://www.jvir.org:443/content/cme
    // https://www.jvir.org:443/content/sir_supplements
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
  } else if ((match = /^\/cms\/([0-9.]+)\/([a-zA-Z0-9.]+)\/([a-z]+)\/([a-zA-Z0-9-]+)\/[a-zA-Z0-9.]+$/i.exec(path)) !== null) {
    // https://www.jvir.org:443/cms/10.1016/j.jvir.2016.09.028/attachment/58dd870f-e7e3-40e9-afed-1897cd74fe9c/mmc2.mp4
    // https://www.jvir.org:443/cms/10.1016/j.jvir.2016.09.028/attachment/8f4a8bdc-6d6a-4fb2-a962-2d5691cfd0c6/mmc1.mp4
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.doi    = match[1] + '/' + match[2];
    result.unitid = match[4];
  } else if ((match = /^\/pb\/assets\/raw\/Health%20Advance\/journals\/jvir\/([a-zA-Z0-9_.-]+).mp3$/i.exec(path)) !== null) {
    // https://www.jvir.org/pb/assets/raw/Health%20Advance/journals/jvir/JVIR_28_1_Funaki_Kim-1482330661327.mp3
    result.rtype  = 'AUDIO';
    result.mime   = 'MISC';
    result.unitid = match[1];
  } else if ((match = /^\/([a-z]+)/i.exec(path)) !== null) {
    // https://www.jvir.org:443/inpress
    // https://www.jvir.org:443/issues
    // https://www.jvir.org:443/multimedia
    // https://www.jvir.org:443/current
    if (match[1] == 'inpress') {
      result.rtype = 'SEARCH';
      result.mime   = 'HTML';
    }
    if (match[1] == 'issues') {
      result.rtype = 'SEARCH';
      result.mime   = 'HTML';
    }
    if (match[1] == 'multimedia') {
      result.rtype = 'SEARCH';
      result.mime   = 'HTML';
    }
    if (match[1] == 'current') {
      result.rtype = 'TOC';
      result.mime   = 'HTML';
    }

  }

  return result;
});
