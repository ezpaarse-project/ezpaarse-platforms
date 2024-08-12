#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sports Business Journal
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

  if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([0-9]{4})\/([0-9]{2})\/([0-9]{2}).aspx$/i.exec(path)) !== null) {
    // https://www.sportsbusinessjournal.com/Daily/Issues/2024/08/07.aspx
    // https://www.sportsbusinessjournal.com/Daily/Issues/2024/08/05.aspx
    // https://www.sportsbusinessjournal.com/Daily/Closing-Bell/2024/08/02.aspx
    // https://www.sportsbusinessjournal.com/Daily/Closing-Bell/2024/07/31.aspx
    // https://www.sportsbusinessjournal.com/SB-Blogs/Newsletter-Football/2024/07/25.aspx
    // https://www.sportsbusinessjournal.com/SB-Blogs/Newsletter-Media/2024/08/05.aspx
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.publication_date = `${match[3]}/${match[4]}/${match[5]}`;
    result.unitid = `${match[2]}/${match[3]}/${match[4]}/${match[5]}`;

  } else if (/^\/([a-zA-Z0-9-]+).aspx$/i.test(path)) {
    // https://www.sportsbusinessjournal.com/Podcasts.aspx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

  } else if ((match = /^\/Articles\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.sportsbusinessjournal.com/Articles/2024/04/26/david-tepper-local-restaurant-critical-sign
    // https://www.sportsbusinessjournal.com/Articles/2024/05/14/jimmy-dunne-resigns-pga-tour-policy-board
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[4];
    result.publication_date = `${match[1]}/${match[2]}/${match[3]}`;
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/${match[4]}`;

  } else if ((match = /^\/Journal\/Issues\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).aspx$/i.exec(path)) !== null) {
    // https://www.sportsbusinessjournal.com/Journal/Issues/2015/08/24/People-and-Pop-Culture/Friday-Night-Lights.aspx?hl=Caitlyn+Clark&sc=0&publicationSource=search
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.db_id    = match[4];
    result.title_id = match[5];
    result.publication_date = `${match[1]}/${match[2]}/${match[3]}`;
    result.unitid   = `${match[1]}/${match[2]}/${match[3]}/${match[4]}/${match[5]}`;

  } else if (/^\/Search\/([a-zA-Z0-9-]+).aspx$/i.test(path)) {
    // https://www.sportsbusinessjournal.com/Search/Site.aspx?searchPhrase=wnba
    // https://www.sportsbusinessjournal.com/Search/Site.aspx?searchPhrase=Caitlyn+Clark&searchType=0&startDate=&endDate=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
