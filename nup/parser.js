#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nursing Reference Center Plus
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

  if (/^\/nup\/results$/i.test(path)== true) {
    // http://web.b.ebscohost.com/nup/results?sid=7092c4c4-1a8b-40d8-919e-ef5683bf9559%40pdc-v-sessmgr04&vid=1&returnSearchUrl=http%3a%2f%2fweb.b.ebscohost.com%2fweb%2fnup%2fhome%2findex%2fall&bquery=asthma&bdata=JnR5cGU9MCZzZWFyY2hNb2RlPVN0YW5kYXJkJnNpdGU9bnVwLWxpdmUmc2NvcGU9c2l0ZQ%3d%3d
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/nup\/detail\/detail$/i.test(path)== true && param.vid == '2') {
    // http://web.b.ebscohost.com/nup/detail/detail?vid=2&sid=7092c4c4-1a8b-40d8-919e-ef5683bf9559%40pdc-v-sessmgr04&bdata=JnNpdGU9bnVwLWxpdmUmc2NvcGU9c2l0ZQ%3d%3d#AN=T700367&db=nup
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  } else if (/^\/nup\/pdfviewer\/pdfviewer$/i.test(path)== true) {
    // http://web.b.ebscohost.com/nup/pdfviewer/pdfviewer?vid=3&sid=7092c4c4-1a8b-40d8-919e-ef5683bf9559%40pdc-v-sessmgr04
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
  } else if (/^\/nup\/detail\/detail$/i.test(path)== true && param.vid == '8') {
    // http://web.b.ebscohost.com/nup/detail/detail?vid=8&sid=7092c4c4-1a8b-40d8-919e-ef5683bf9559%40pdc-v-sessmgr04&bdata=JnNpdGU9bnVwLWxpdmUmc2NvcGU9c2l0ZQ%3d%3d#AN=2009565242&db=nup
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
  } else if (/^\/embimages\/pcms\/([0-9a-z-]+)\.png$/i.test(path)== true) {
    // http://imagesrvr.epnet.com/embimages/pcms/I501546-hidef.png
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
  } else if (/^\/nup\/detail\/detail$/i.test(path)== true && param.vid == '12') {
    // http://web.b.ebscohost.com/nup/detail/detail?vid=12&sid=af2ce1ab-67ce-4992-8606-d81af2acfb6b%40sessionmgr103&bdata=JnNpdGU9bnVwLWxpdmUmc2NvcGU9c2l0ZQ%3d%3d#AN=V100458&db=nup
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
  }

  return result;
});
