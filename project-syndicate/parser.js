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
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  }

  return result;
});
