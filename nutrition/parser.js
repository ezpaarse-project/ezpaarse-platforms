#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nutrition Reference Center
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

  if (/^\/nurc\/results$/i.test(path) == true) {
    // http://web.a.ebscohost.com/nurc/results?sid=3aa9e6e6-517f-4642-abab-88ea5a402a5c%40sessionmgr4006&vid=3&returnSearchUrl=http%3a%2f%2fweb.a.ebscohost.com.tafeqld.idm.oclc.org%2fweb%2fnurc%2fhome%2findex%2fall%3fq%3dflorence%2bnightingale%26FindFieldMessagesUrl%3d%252Fnurc%252FNewSearch%252FFindFieldMessages%253Fsid%253D3aa9e6e6-517f-4642-abab-88ea5a402a5c%2540sessionmgr4006%2526vid%253D1%2526messageId%253DNoSearchResults&bquery=white+blood+cells&bdata=JnR5cGU9MCZzZWFyY2hNb2RlPVN0YW5kYXJkJnNpdGU9bnVyYy1saXZlJnNjb3BlPXNpdGU%3d
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/nurc\/detail\/detail$/i.test(path) == true && param.vid == '4') {
    // http://web.a.ebscohost.com/nurc/detail/detail?vid=4&sid=3aa9e6e6-517f-4642-abab-88ea5a402a5c%40sessionmgr4006&bdata=JnNpdGU9bnVyYy1saXZlJnNjb3BlPXNpdGU%3d#AN=T908311&db=nuc
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  } else if (/^\/nurc\/pdfviewer\/pdfviewer$/i.test(path) == true) {
    // http://web.a.ebscohost.com/nurc/pdfviewer/pdfviewer?vid=5&sid=3aa9e6e6-517f-4642-abab-88ea5a402a5c%40sessionmgr4006
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
  } else if (/^\/nurc\/detail\/detail$/i.test(path) == true && param.vid == '12') {
    // http://web.a.ebscohost.com/nurc/detail/detail?vid=12&sid=3aa9e6e6-517f-4642-abab-88ea5a402a5c%40sessionmgr4006&bdata=JnNpdGU9bnVyYy1saXZlJnNjb3BlPXNpdGU%3d#db=nuc&AN=2013141487
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
  }

  return result;
});
