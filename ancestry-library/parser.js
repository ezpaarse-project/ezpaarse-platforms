#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ancestry Library
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

  if ((match = /^\/search\/$/i.exec(path)) !== null) {
    // https://www.ancestrylibrary.com/search/?name=Arthur_Duffy&event=_chicago-cook-illinois-usa_36829
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/cgi-bin\/sse.dll$/i.exec(path)) !== null) {
    // https://search.ancestrylibrary.com/cgi-bin/sse.dll?indiv=1&dbid=2545&h=487425&tid=&pid=&queryId=1534c563886ae4886c9c1c3203bea2e9&usePUB=true&_phsrc=aTR11&_phstart=successSource
    // https://search.ancestrylibrary.com/cgi-bin/sse.dll?indiv=1&dbid=1629&h=7804662&tid=&pid=&queryId=3d9b15eb0aaa42acd7c22e8984e6b2d7&usePUB=true&_phsrc=aTR12&_phstart=successSource
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.queryId;
  } else if ((match = /^\/imageviewer\/collections\/[0-9]+\/images\/([0-9a-z-_]+)$/i.exec(path)) !== null) {
    // https://www.ancestrylibrary.com/imageviewer/collections/1629/images/30849_120511-03455?treeid=&personid=&hintid=&queryId=3d9b15eb0aaa42acd7c22e8984e6b2d7&usePUB=true&_phsrc=aTR12&_phstart=successSource&usePUBJs=true&pId=7804662
    // https://www.ancestrylibrary.com/imageviewer/collections/2238/images/44037_04_00002-02600?treeid=&personid=&hintid=&queryId=8f0663d1f0268f89592673ceb32b3245&usePUB=true&_phsrc=aTR15&_phstart=successSource&usePUBJs=true&pId=197290657
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.unitid   = match[1];
  }

  return result;
});
