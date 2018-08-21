#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform BioTechniques
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

  if (/^\/(journal\/btn)|(btn\/mostcited)$/i.test(path)) {
    // https://www.future-science.com:443/journal/btn
    // https://www.future-science.com:443/btn/mostcited
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/btn\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.future-science.com:443/btn/newsandmedia
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/([a-z]{3})\/((.*)\/(.*))$/i.exec(path)) !== null) {
    // https://www.future-science.com:443/btn/interview/15
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    switch (match[1]) {
    case 'doi':
      result.unitid   = match[4];
      result.doi      = match[2];
      break;
    default:
      result.title_id = match[2];
      result.unitid   = match[2];
      break;
    }
  } else if (/^\/(action\/doSearch)|(author\/.*)$/i.test(path)) {
    // https://www.future-science.com:443/author/Liew%2C+Teresa
    // https://www.future-science.com:443/action/doSearch?AllField=pizza
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/(viewtopic|viewforum).php$/i.test(path)) {
    // http://forums.biotechniques.com:80/viewtopic.php?f=2&t=45158
    // http://forums.biotechniques.com:80/viewforum.php?f=28
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  }

  return result;
});
