#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Keiyou Digital Library
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

  if (/^\/Search$/i.test(path)) {
    // https://lib.keiyou.jp/Search?mode=1&pkg=diamond&pkg=toyokeizai&pkg=toyokeizai-2nd&pkg=DHBR_Part1&pkg=Economist_1960s&pkg=Economist_1970s&pkg=Economist_1980s&pkg=domei&pkg=WeeklyPhotographic&pkg=fuzokugaho&title=food&author=&ideo=1&pdrange=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/TViewer$/i.test(path)) {
    // https://lib.keiyou.jp/TViewer?doi=99.9997/S0-1-DWU&p=9&wd=food
    // https://lib.keiyou.jp/TViewer?doi=99.9997/S0-1-I9W&p=2&wd=photo
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.doi      = param.doi;
    result.unitid   = param.doi;
  }

  return result;
});
