#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Moazine
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

  // let match;

  if (/^\/viewer\/index.asp$/i.test(path) && param.libraryid !== undefined && param.a_i !== undefined) {
    // https://dl.moazine.com/viewer/index.asp?libraryid=9MtJb2T3nzH3ppyI80SROWr0QWyO83k5BFv3&a_i=t8ZaG3L2fLt0mqxw047G3N52&keyword=&s_i=9#page/4
    // https://dl.moazine.com/viewer/index.asp?libraryid=9MtJb2T3nzH3ppyI80SROWr0QWyO83k5BFv3&a_i=zMiEy459oEr2xCSj04a6JWR0&keyword=&s_i=9#page/2
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.first_page = parsedUrl.hash.split('/')[1];
    result.unitid = `${param.libraryid}&a_i=${param.a_i}`;

  } else if (/^\/lib\/default_s.asp$/i.test(path)) {
    // http://dl.moazine.com/lib/default_s.asp?dl=9MtJb2T3nzH3ppyI80SROWr0QWyO83k5BFv3&searchTxt=news&classTxt=%C0%FC%C3%BC&date0=%BC%B1%C5%C3&date1=%BC%B1%C5%C3
    // http://dl.moazine.com/lib/default_s.asp?dl=9MtJb2T3nzH3ppyI80SROWr0QWyO83k5BFv3&searchTxt=business&classTxt=%C0%FC%C3%BC&date0=%BC%B1%C5%C3&date1=%BC%B1%C5%C3
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
