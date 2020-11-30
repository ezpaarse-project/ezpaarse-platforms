#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Swank Digital
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

  if ((match = /^\/[0-9a-z]+\/play\/([0-9A-Z]+)$/i.exec(path)) !== null) {
    //https://digitalcampus.swankmp.net/osu339411/play/B71A966455B449C5
    //https://digitalcampus.swankmp.net/osu339411/play/8C308D3290987083

    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[1];

  } else if ((match = /^\/[0-9a-z]+\/category$/i.exec(path)) !== null) {
    // https://digitalcampus.swankmp.net/osu339411/category
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
