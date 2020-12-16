#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Novelist
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);


  if (/^\/novp\/(genres|appeals|awards|audiobooks)$/i.test(path) == true) {
    // http://web.b.ebscohost.com/novp/genres?vid=5&sid=210938d6-eeb1-4530-99e0-2f744386bae1%40pdc-v-sessmgr05
    // http://web.b.ebscohost.com/novp/appeals?vid=7&sid=210938d6-eeb1-4530-99e0-2f744386bae1%40pdc-v-sessmgr05
    // http://web.b.ebscohost.com/novp/awards?vid=12&sid=210938d6-eeb1-4530-99e0-2f744386bae1%40pdc-v-sessmgr05
    // http://web.b.ebscohost.com/novp/audiobooks?vid=14&sid=210938d6-eeb1-4530-99e0-2f744386bae1%40pdc-v-sessmgr05 
    result.rtype    = 'MISC';
    result.mime     = 'HTML';

  } else if (/^\/novp\/search\/(novbasic|advanced)$/i.test(path) == true) {
    // http://web.b.ebscohost.com/novp/search/novbasic?vid=0&sid=210938d6-eeb1-4530-99e0-2f744386bae1%40pdc-v-sessmgr05
    // http://web.b.ebscohost.com/novp/search/advanced?vid=1&sid=210938d6-eeb1-4530-99e0-2f744386bae1%40pdc-v-sessmgr05
    result.rtype    = 'MISC';
    result.mime     = 'HTML';
  } else if (/^\/novp\/(results|resultsadvanced)$/i.test(path) == true) {
    // http://web.b.ebscohost.com/novp/results?vid=1&sid=0b225b23-79fa-4463-a155-c1d0f4e87ef8%40pdc-v-sessmgr03&bquery=science+fiction&bdata=JnR5cGU9MCZzZWFyY2hNb2RlPUFuZCZzaXRlPW5vdnAtbGl2ZQ%3d%3d
    // http://web.b.ebscohost.com/novp/resultsadvanced?vid=5&sid=0b225b23-79fa-4463-a155-c1d0f4e87ef8%40pdc-v-sessmgr03&bquery=science+fiction+AND+Black&bdata=JnR5cGU9MSZzZWFyY2hNb2RlPUFuZCZzaXRlPW5vdnAtbGl2ZQ%3d%3d
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/novp\/detail$/i.test(path) == true) {
    // http://web.b.ebscohost.com/novp/detail?vid=2&sid=0b225b23-79fa-4463-a155-c1d0f4e87ef8%40pdc-v-sessmgr03&bdata=JnNpdGU9bm92cC1saXZl#UI=10232623&db=neh
    // http://web.b.ebscohost.com/novp/detail?vid=6&sid=0b225b23-79fa-4463-a155-c1d0f4e87ef8%40pdc-v-sessmgr03&bdata=JnNpdGU9bm92cC1saXZl#UI=10233087&db=neh
    // http://web.b.ebscohost.com/novp/detail?vid=15&sid=0b225b23-79fa-4463-a155-c1d0f4e87ef8%40pdc-v-sessmgr03&bdata=JnNpdGU9bm92cC1saXZl#UI=447659&db=neh
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
  }

  return result;
});
