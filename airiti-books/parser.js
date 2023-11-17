#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Airiti Books
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

  //let match;

  if (/^\/pdfViewer\/index\.aspx$/i.test(path)) {
    // https://www.airitibooks.com/pdfViewer/index.aspx?Token=085A7B27-9DC4-4B45-9CA7-F09CDAD40DBC&GoToPage=-1
    // https://www.airitibooks.com/pdfViewer/index.aspx?Token=6B45D8F8-10A2-4947-B204-5781BD9EA907&GoToPage=-1
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = param.Token;

  } else if (/^\/Detail\/Detail$/i.test(path)) {
    // https://www.airitibooks.com/Detail/Detail?PublicationID=P20221121101&DetailSourceType=0
    // https://www.airitibooks.com/Detail/Detail?PublicationID=P20220614180&DetailSourceType=0
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.pii = param.PublicationID;
    result.unitid   = param.PublicationID;
  } else if (/^\/Search\/Results$/i.test(path)) {
    // https://www.airitibooks.com/Search/Results?SearchFieldList_obj=%5B%7B%22SearchString%22%3A%22International%22%2C%22SearchType%22%3A%22%25E6%2589%2580%25E6%259C%2589%25E6%25AC%2584%25E4%25BD%258D%22%2C%22SearchFieldCondition%22%3A%22AND%22%7D%5D&OutputKeyinSearchFieldList_obj=%5B%7B%22SearchString%22%3A%22International%22%2C%22SearchType%22%3A%22%25E6%2589%2580%25E6%259C%2589%25E6%25AC%2584%25E4%25BD%258D%22%2C%22SearchFieldCondition%22%3A%22AND%22%7D%5D&IsLibraryCollections=Y&toPage=
    // https://www.airitibooks.com/Search/Results?SearchFieldList_obj=%5B%7B%22%24S%24%22%3A%22Application%22%2C%22%24T%24%22%3A%22%25E6%2589%2580%25E6%259C%2589%25E6%25AC%2584%25E4%25BD%258D%22%2C%22%24SC%24%22%3A%22AND%22%7D%5D&OutputKeyinSearchFieldList_obj=%5B%7B%22%24S%24%22%3A%22Application%22%2C%22%24T%24%22%3A%22%25E6%2589%2580%25E6%259C%2589%25E6%25AC%2584%25E4%25BD%258D%22%2C%22%24SC%24%22%3A%22AND%22%7D%5D&Years=%5B%221000~2023%22%5D&IsLibraryCollections=N&Sort=0&PageSize=20
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
