#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Duxiu
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/([a-zA-Z.]+)?$/i.exec(path)) !== null) {
    if ((match[1] === 'getPage') || (match[1] === 'gosearch.jsp') || (match[1] === 'searchEncy') || (match[1] === 'searchGovernment') || (match[1] === 'searchInfo')) {
    // http://qw.duxiu.com:80/getPage?sw=potato&ecode=utf-8
    // http://book.duxiu.com:80/gosearch.jsp?sw=brain&allsw=%23%2Callbrain&searchtype=&channel=searchDoc&bCon=&ecode=utf-8&Field=all
    // http://book.duxiu.com:80/searchEncy?Field=all&channel=searchEncy&sw=carrot&ecode=utf-8&edtype=&searchtype=&view=0
    // http://vrefer.duxiu.com:80/searchGovernment?Field=all&channel=searchGovernment&sw=bridge&ecode=utf-8&edtype=&searchtype=&view=0
    // http://book.duxiu.com:80/searchInfo?Field=all&channel=searchInfo&sw=blacksmith&ecode=utf-8&edtype=&searchtype=&view=0
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    }
    if ((match[1] === 'bookDetail.jsp') || (match[1] === 'courseDetail.jsp') || (match[1] === 'CPDetail.jsp') || (match[1] === 'EncyDetail.jsp') || (match[1] === 'godownexam.jsp') || (match[1] === 'InfoDetail.jsp') || (match[1] === 'JourDetail.jsp') || (match[1] === 'NPDetail.jsp') || (match[1] === 'patentDetail.jsp') || (match[1] === 'publicinfoDetail') || (match[1] === 'searchDict') || (match[1] === 'StdDetail.jsp') || (match[1] === 'thesisDetail.jsp') || (match[1] === 'videoDetail.jsp')) {
    // http://book.duxiu.com:80/bookDetail.jsp?dxNumber=000016213781&d=BF1D22D4A90B8ADF9CF61B0CCCB1676C
    // http://book.duxiu.com:80/courseDetail.jsp?dxid=400100671692&d=63CDE68AB1857D663BDBD25D7BA230A9&sw=mind&ecode=utf-8
    // http://jour.duxiu.com:80/CPDetail.jsp?dxNumber=330107221474&d=DB048A79FEB38102452708AADB2C8C3D
    // http://book.duxiu.com:80/EncyDetail.jsp?dxid=403710174382&d=381ABC9CE704439D88399C30752F2025
    // http://book.duxi.com:80/godownexam.jsp?dxid=400112204339&d=A5C339C6E04F539F99907F7C6EB28114
    // http://book.duxiu.com:80/InfoDetail.jsp?dxNumber=360118685645&d=9259B2820DFD44F2BF758DA1042B19ED
    // http://jour.duxiu.com:80/JourDetail.jsp?dxNumber=100258237321&d=B46BAE24AC2B4A43E08D625E2B268E35
    // http://newspaper.duxiu.com:80/NPDetail.jsp?dxNumber=300325262136&d=6EEB65558274CC8C3C28B6452C9FE086
    // http://book.duxiu.com:80/patentDetail.jsp?dxid=166022216488&d=9E19A092352F1948D5F49FCC047ED567
    // http://vrefer.duxiu.com:80/publicinfoDetail?dxid=400505987423&d=4823920D633F84E1A5831BF35AC1CDB9
    // http://book.duxiu.com:80/searchDict?Field=all&channel=searchDict&sw=mind&ecode=utf-8&edtype=&searchtype=&view=0
    // http://book.duxiu.com:80/StdDetail.jsp?dxid=320150885025&d=4E5400CB12C210379C0120228B11B8BD
    // http://jour.duxiu.com:80/thesisDetail.jsp?dxNumber=390102513141&d=C90969D30D1392AC1689F64A75418331
    // http://book.duxiu.com:80/videoDetail.jsp?dxid=163803630969&d=9D8F4B491F23F40CC4FB78A9FD84C68D
      result.rtype    = 'REF';
      result.mime     = 'HTML';
      result.title_id = param.dxNumber || param.dxid || param.sw;
      result.unitid   = param.d;
    }
    if (match[1] === 'readDetail.jsp') {
    // http://book.duxiu.com:80/readDetail.jsp?dxNumber=000005229290&d=D2D23AD5C1D5E69A0680AEC4A4E9AA2E&t=3
      result.rtype     = 'BOOK_SECTION';
      result.mime      = 'HTML';
      result.title_id  = param.dxNumber;
      result.unitid    = param.d;
    }
    if (match[1] === 'godownpdf.jsp') {
    // http://qw.duxiu.com:80/godownpdf.jsp?kid=65676B686B686C6D3637353530333734&pagenum=99&epage=101&a=188F458266335F85D0B1C7D2B4EEB69D&bt=qw&dxNumber=000030080757&sch=brain&zjid=000030080757_37
      result.rtype     = 'BOOK_SECTION';
      result.mime      = 'PDF';
      result.title_id  = param.dxNumber;
      result.unitid    = param.a;
    }
    if (match[1] === 'godowndoc.jsp') {
    // http://book.duxiu.com:80/godowndoc.jsp?dxid=400640416056&d=7746EE1637C2B4D6C67B2F6827B41DE5
      result.rtype     = 'ARTICLE';
      result.mime      = 'PDF';
      result.title_id  = param.dxid;
      result.unitid    = param.d;
    }
  }

  return result;
});
