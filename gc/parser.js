#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Gale Cengage
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/ps\/([a-zA-z]+).do$/.exec(path)) !== null) {
    // /ps/eToc.do
    //?userGroupName=franche&prodId=GVRL&inPS=true&action=DO_BROWSE_ETO
    //isETOC=true&inPS=true&prodId=GVRL&userGroupName=unipari&resultListType=RELATED_DOCUMENT
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    if (/[\w]Toc/.test(match[1])) {
      result.rtype    = 'TOC';
    }
    if (param.docId) {
      result.title_id = param.docId;
      result.unitid   = param.docId + '_' + param.contentSegment;
    }
    if (param.workId && /[\w\W]pdf/.test(param.workId)) {
      result.mime     = 'PDF';
      result.unitid   = param.docId + '_' + param.workId.split('|')[0];
    }

  } else if ((match = /^\/cgi-bin\/([a-z]+)$/.exec(path)) !== null) {
    //http://rs.go.galegroup.com/cgi-bin/rsent
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'MISC';
    if (param.docId && param.contentSegment) {
      result.title_id = param.docId;
      result.unitid   = param.docId + '_' + param.contentSegment;
    }
  }

  return result;
});

