#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Airiti Library
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

  if (/^\/Article\/Detail$/i.test(path) && param.DocID !== undefined) {
    // https://www.airitilibrary.com/Article/Detail?DocID=10131671-N202406080006-00001
    // https://www.airitilibrary.com/Article/Detail?DocID=02541319-200312-41-4-165-172-a
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = param.DocID;

  } else if (/^\/Publication\/alDetailedMesh$/i.test(path) && param.DocID !== undefined && param.PublishTypeID !== undefined) {
    // https://www.airitilibrary.com/Publication/alDetailedMesh?DocID=P20140627004-N202306030013-00001&PublishTypeID=P001
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    let str = param.DocID.split('-');
    result.issue      = str[1];
    result.title_id   = str[0];
    result.unitid     = param.DocID;

  } else if (/^\/Publication\/alPublicationJournal$/i.test(path) && param.PublicationID !== undefined) {
    // https://www.airitilibrary.com/Publication/alPublicationJournal?PublicationID=P20140627004&IssueID=N202306030013
    // https://www.airitilibrary.com/Publication/alPublicationJournal?PublicationID=P20140627004
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id   = param.PublicationID;
    result.unitid     = param.IssueID?param.IssueID:param.PublicationID;

  } else if (/^\/Search\/ArticleSearch$/i.test(path)) {
    // https://www.airitilibrary.com/Search/ArticleSearch?ArticlesViewModel_SearchField=special+issue&ArticlesViewModel_TitleKeywordsAbstract=&ArticlesViewModel_FulltextSearchField=&ArticlesViewModel_Author=&ArticlesViewModel_JournalBookDepartment=&ArticlesViewModel_DOI=&ArticlesViewModel_ArticleArea_Taiwan=false&ArticlesViewModel_ArticleArea_ChinaHongKongMacao=false&ArticlesViewModel_ArticleArea_American=false&ArticlesViewModel_ArticleArea_Other=false&PublicationsViewModel_SearchField=&PublicationsViewModel_PublicationName=&PublicationsViewModel_ISSN=&PublicationsViewModel_PublicationUnitName=&PublicationsViewModel_DOI=&PublicationsViewModel_PublicationArea_Taiwan=false&PublicationsViewModel_PublicationArea_ChinaHongKongMacao=false&PublicationsViewModel_PublicationArea_American=false&PublicationsViewModel_PublicationArea_Other=false
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  }

  return result;
});
