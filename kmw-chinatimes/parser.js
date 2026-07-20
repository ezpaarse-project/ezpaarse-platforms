#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform KMW Chinatimes
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/News\/BanImgContent\.aspx/i.test(path)) {
    // /News/BanImgContent.aspx?logno=KMW07&OriSourceType=A&ArticleDate=2026/7/11%20%E4%B8%8A%E5%8D%88%2012:00:00&BanImg=20260711CM-R3%E5%9C%8BAB&Title=%E7%B5%B1%E4%B8%80%E4%B8%8A%E5%8D%8A%E5%B9%B4%E7%87%9F%E6%94%B6%20%E5%90%8C%E6%9C%9F%E6%96%B0%E9%AB%98&BanName=%E8%B2%A1%E7%B6%93%E8%A6%81%E8%81%9E&keyword=%E8%B6%B3%E7%90%83
    // /News/BanImgContent.aspx?logno=KMW07&OriSourceType=B&ArticleDate=2026/7/13%20%E4%B8%8A%E5%8D%88%2012:00:00&BanImg=20260713CT-L75%E5%9C%8BAB&Title=%E4%B8%96%E8%B6%B3%E3%80%8B%E5%8F%B2%E5%8D%A1%E6%B4%9B%E5%B0%BC%E5%9D%A6%E8%A8%80%E6%9C%89%E9%81%8B%E6%B0%A3%20%E9%81%BF%E8%AB%87%E4%B8%96%E4%BB%87%E5%B0%8D%E6%B1%BA&BanName=2026%E4%B8%96%E8%B6%B3%E8%B3%BD%E7%89%B9%E5%88%A5%E5%A0%B1%E5%B0%8E&keyword=%E8%B6%B3%E7%90%83
    result.rtype = 'IMAGE';
    result.mime  = 'HTML';
    if (param.logno) { result.unitid = param.logno; }

  } else if (/^\/News\/ImgSResultList\.aspx/i.test(path)) {
    // /News/ImgSResultList.aspx?srcIds=1,2,3&sDate=2026/07/06&eDate=2026/07/13&sKeyword=%E8%B6%B3%E7%90%83&sImple=1
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/News\/NewsContent\.aspx/i.test(path)) {
    // /News/NewsContent.aspx?logno=KMW01&uid=1_B\20260617\N0133.001&OriSourceType=B&sdate=2026/06/17&sKeyword=%E9%98%B2%E7%96%AB
    // /News/NewsContent.aspx?logno=KMW01&uid=1_B\20260711\N0095.001&OriSourceType=B&sdate=2026/07/11&sKeyword=%E8%B6%B3%E7%90%83
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.uid) { result.unitid = param.uid; }

  } else if (/^\/News\/NewsSearch\.aspx/i.test(path)) {
    // /News/NewsSearch.aspx?searchkind=s
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/EpubContent\/[^/]+\/\d+\/(\d+)\//i.exec(path))) {
    // /EpubContent/2303/2026/20260710/OEBPS/P-0001-00.html
    // /EpubContent/2303/2026/20260713/OEBPS/P-0006-01.html
    result.rtype  = 'ARTICLE';
    result.mime   = 'EPUB';
    result.unitid = match[1];

  } else if (/^\/DigtalBP\/Preview\.aspx/i.test(path)) {
    // /DigtalBP/Preview.aspx?logno=KMW16&s=2303&i=20260713&sdate=2026-07-13&stype=2
    result.rtype = 'IMAGE';
    result.mime  = 'HTML';
    if (param.i) { result.unitid = param.i; }

  } else if (/^\/DigtalBP\/FVImgPreview\.aspx/i.test(path)) {
    // /DigtalBP/FVImgPreview.aspx?logno=KMW16&src=2303&sisse=20260713&sdate=2026-07-13&sUrl=Action/B/[issue]&stype=2
    result.rtype = 'IMAGE';
    result.mime  = 'HTML';
    if (param.sisse) { result.unitid = param.sisse; }

  } else if (/^\/Chinatimes\/EFNewsContetn\.aspx/i.test(path)) {
    // /Chinatimes/EFNewsContetn.aspx?logno=KMW02&sNo=0895&sDate=20260713
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.sNo) { result.unitid = param.sNo; }

  } else if (/^\/Chinatimes\/ArticleContent\.aspx/i.test(path)) {
    // /Chinatimes/ArticleContent.aspx?logno=KMW14&s=&aid=20260713001536&cid=260405&sdate=2026/07/13
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.aid) { result.unitid = param.aid; }
  }

  return result;
});
