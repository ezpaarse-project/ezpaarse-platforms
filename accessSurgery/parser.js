#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * [description-goes-here]
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.path;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  /**
   * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
   * it described the most fine-grained of what's being accessed by the user
   * it can be a DOI, an internal identifier or a part of the accessed URL
   * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
  */

  if ((match = /ResourceType=Book/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/UserDashboard/AddFavorites?ResourceId=853&ResourceType=Book
    match = (/ResourceId=(.*?)&/).exec(path);
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid     = match[1];
  } else if ((match = /ResourceType=Multimedia/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/UserDashboard/AddFavorites?ResourceId=5481748&ResourceType=Multimedia
    match = (/ResourceId=(.*?)&/).exec(path);
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[1];
  } else if ((match = /ResourceType=gbos/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/UserDashboard/UpdateRecentlyViewed?ResourceId=367753&ResourceType=gbos&IsDeleted=false
    match = (/ResourceId=(.*?)&/).exec(path);
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /content.aspx\?bookid=.*&sectionid=/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/content.aspx?bookid=2057&sectionid=156216523
    match = /sectionid=(.*)/.exec(path);
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /SearchResults/.exec(path)) !== null) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /content.aspx\?sectionid=.*?&bookid/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/content.aspx?sectionid=80027398&bookid=1340&jumpsectionID=80027404&Resultclick=2
    match = /sectionid=(.*?)&/.exec(path);
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /\/Content\/CaseContent\//.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/Content/CaseContent/TakeQuizOneByOne?sectionId=130873251
    match = /sectionId=(.*)/.exec(path);
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /drugs.aspx\/displayMonograph/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/drugs.aspx/displayMonograph
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  } else if ((match = /drugs.aspx\/displayDrug/.exec(path)) !== null) {
    // http://accesssurgery.mhmedical.com:80/drugs.aspx/displayDrugDetailByNDC9FromLexiAPI
    result.rtype    = 'REF';
    result.mime     = 'HTML';
  }

  return result;
});
