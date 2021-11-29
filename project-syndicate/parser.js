#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Project Syndicate
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

  let match;
  /** --- matching searches viewed --- */
  if ((match = /^\/archive/i.exec(path)) !== null) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  /** --- matching articles viewed --- */
  } else if ((match = /^\/(\w+)\/([\w\-\w]+)-by/i.exec(path)) !== null) {
  //if ((match = /^\/(commentary|onpoint|culture-society)\/(.+)\-by\-/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[1];

  /** --- matching sections browsed --- */
  } else if ((match = /^\/(section)\/([\w\-\w]+)$/i.exec(path)) !== null) {
    //https://www.project-syndicate.org:443/section/culture-society
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/videos\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://www.project-syndicate.org/videos/ps-events-building-the-green-consensus
    result.rtype    = 'VIDEO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/podcasts\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.project-syndicate.org/podcasts/the-gig-economy-2-0
    result.rtype    = 'AUDIO';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/[a-z-]+\/([\w\-\w]+)-[0-9]{4}-[0-9]{2}$/i.exec(path)) !== null) {
    // https://www.project-syndicate.org/say-more/an-interview-with-jan-werner-mueller-2021-10?a_la=english&a_d=616d8815c907f06ac9e71b50&a_m=&a_a=click&a_s=&a_p=homepage&a_li=an-interview-with-jan-werner-mueller-2021-10&a_pa=saymore&a_ps=&a_ms=&a_r=
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];    
  } else if ((match = /^\/[a-z-]+\/([\w\-\w]+)$/i.exec(path)) !== null) {
    // https://www.project-syndicate.org/bigpicture/the-great-cop-out?a_la=english&a_d=6183ab4d4639210165c00e7c&a_m=&a_a=click&a_s=&a_p=homepage&a_li=the-great-cop-out&a_pa=curated&a_ps=a2-bigpicture&a_ms=&a_r=    result.rtype    = 'ARTICLE';
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];    
  }

  return result;
});
