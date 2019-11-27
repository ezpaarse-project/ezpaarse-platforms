#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Foreign Policy
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/(category|channel)\/([a-z-]+)\/$/i.test(path)) || (/^\/(podcasts)\/([a-z-]+)$/i.test(path)) || (/^\/staff\/$/i.test(path))) {
    // https://foreignpolicy.com:443/category/elephants-in-the-room/
    // https://foreignpolicy.com:443/channel/news/
    // https://foreignpolicy.com:443/podcasts/and-now-the-hard-part
    // https://foreignpolicy.com:443/staff/
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/([0-9/]+)\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://foreignpolicy.com:443/2019/07/20/space-research-can-save-the-planet-again-climate-change-environment/
    // https://foreignpolicy.com:443/2019/07/12/document-of-the-week-is-the-u-n-revisiting-the-ban-on-big-tobacco/?_ga=2.253152393.162079277.1569943157-788119408.1569943157
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/author\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://foreignpolicy.com:443/author/robbie-gramer/?_ga=2.256846859.162079277.1569943157-788119408.1569943157
    // https://foreignpolicy.com:443/author/colum-lynch/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/podcasts\/([a-z-]+)\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://foreignpolicy.com:443/podcasts/and-now-the-hard-part/resetting-the-u-s-relationship-with-saudi-arabia/
    // https://foreignpolicy.com:443/podcasts/first-person/roots-of-a-quagmire/
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[2];

  }

  return result;
});
