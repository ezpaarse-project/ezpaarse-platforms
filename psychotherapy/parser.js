#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Psychotherapy.net
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

  if ((match = /^\/stream\/digitaltheologicallibrary\/search$/i.exec(path)) !== null) {
    // http://www.psychotherapy.net/stream/digitaltheologicallibrary/search?q=assessment
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/articles\/new-releases$/i.exec(path)) !== null) {
    // https://www.psychotherapy.net/articles/new-releases#addsearch=blo
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/stream\/digitaltheologicallibrary\/video$/i.exec(path)) !== null) {
    // http://www.psychotherapy.net/stream/digitaltheologicallibrary/video?vid=414
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = param.vid;
  } else if ((match = /^\/article\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.psychotherapy.net/article/becoming-myself-irvin-yalom
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/video\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.psychotherapy.net/video/dialectical-behavior-therapy-linehan
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid = match[1];
  }

  return result;
});
