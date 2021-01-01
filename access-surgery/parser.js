#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Access Medicine
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
  //console.error(parsedUrl);

  let hash;

  if (parsedUrl.hash) {
    hash = parsedUrl.hash
      .replace('#', '')
      .split('&')
      .reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
      }, {});
  } else {
    hash = {};
  }

  //console.error(hash.monoNumber);

  if (/^\/updatesContent\.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/updatesContent.aspx?gbosid=555081&sectionid=252895650&categoryid=41174
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.gbosid;
  } else if (/^\/drugs\.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/drugs.aspx#monoNumber=423186&sectionID=00&tab=tab0
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = hash.monoNumber;
  } else if (/^\/book.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/book.aspx?bookID=1755
    // https://accesssurgery.mhmedical.com/book.aspx?bookID=2576
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.bookID;
  } else if (/^\/content.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/content.aspx?bookid=2576&sectionid=210404908
    // https://accesssurgery.mhmedical.com/content.aspx?bookid=2961&sectionid=250821086
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.bookid + '-' + param.sectionid;
  } else if (/^\/CaseContent.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/CaseContent.aspx?gbosID=246092&gbosContainerID=92&viewByNumber=false&groupid=0
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.gbosID;
  } else if (/^\/ViewLarge.aspx$/i.test(path) == true) {
    // https://accesssurgery.mhmedical.com/ViewLarge.aspx?figid=222022974&gbosContainerID=0&gbosid=0&groupID=0&sectionId=210404908&multimediaId=undefined
    result.rtype    = 'FIGURE';
    result.mime     = 'HTML';
    result.unitid   = param.figid;
  }

  return result;
});


