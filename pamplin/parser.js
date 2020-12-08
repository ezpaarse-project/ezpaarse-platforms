#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Pamplin Media
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

  if (/^\/component\/search\/$/i.test(path) == true) {
    // https://pamplinmedia.com/component/search/?searchword=Trump&searchphrase=all&Itemid=1353
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/[a-z-]+\/[a-z-]+$/i.test(path) == true) {
    // https://pamplinmedia.com/portland-tribune-sports/portland-tribune-winterhawks
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/^\/(pt|obits|scs)\/[0-9a-z-]+\/[0-9a-z-]+$/i.test(path) == true) {
    // https://pamplinmedia.com/pt/9-news/486521-391870-garbage-fee-hikes-ahead-in-multnomah-washington-clackamas
    // https://pamplinmedia.com/obits/180-scs-obituaries/485897-391391-kenneth-houser
    // https://pamplinmedia.com/scs/84-opinion/486334-391524-opinion-for-our-kids-sake-its-time-to-reopen-oregons-schools
    // https://pamplinmedia.com/scs/83-news/486769-391894-firearm-measure-passes
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

  }

  return result;
});
