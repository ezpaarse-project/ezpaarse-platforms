#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Nurimedia
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  //  let match;

  if ((/^\/search/i.test(path)) || (/^\/popular\/main/i.test(path))) {
    // http://www.dbpia.co.kr:80/search/topSearch?startCount=0&collection=ALL&startDate=&endDate=&filter=&prefix=&range=A&searchField=ALL&sort=RANK&reQuery=&realQuery=&exquery=&query=brain&collectionQuery=&srchOption=*
    // http://www.krpia.co.kr:80/search/product?keyword=brain&facetScopes=title&sort=ACCURACY&listCount=20&page=1
    // http://www.krpia.co.kr:80/popular/main
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/journal\/(iprdDetail|publicationDetail|voisDetail)$/i.test(path)) {
    // http://www.dbpia.co.kr:80/journal/iprdDetail?iprdId=IPRD00013157
    // http://www.dbpia.co.kr:80/journal/publicationDetail?publicationId=PLCT00002268
    // http://www.dbpia.co.kr:80/journal/voisDetail?voisId=VOIS00418511
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.iprdId || param.publicationId || param.voisId;
    result.unitid   = param.iprdId || param.publicationId || param.voisId;

  } else if (/^\/product\/main$/i.exec(path)) {
    // http://www.krpia.co.kr:80/product/main?plctId=PLCT00007572
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.plctId;
    result.unitid   = param.plctId;

  } else if (/^\/journal\/articleDetail$/i.exec(path)) {
    // http://www.dbpia.co.kr:80/journal/articleDetail?nodeId=NODE08009642
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = param.nodeId;
    result.unitid   = param.nodeId;

  } else if (/^\/author\/authorDetail$/i.exec(path)) {
    // http://www.dbpia.co.kr:80/author/authorDetail?ancId=2737119
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = param.ancId;
    result.unitid   = param.ancId;

  } else if (/^\/File\/Download/i.test(path)) {
    // http://download.dbpia.co.kr:80/File/Download?nodeId=NODE07624301&isCv=Y&ssoSeq=1029680422&icstId=ICST00006519&b2cMembId=&dIndex=86466832&uIp=170.140.142.252&lty=003001&dty=091002&isCv=Y&lang=kr&prevPathCode=&lognId=&lognFmatCode=&lognUseType=151002
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.nodeId;
    result.unitid   = param.nodeId;

  } else if (/^\/viewer.do/i.test(path)) {
    // http://viewer.dbpia.co.kr:80/viewer.do?plctId=&page=1&systemCode=&documentId=3952&serviceName=krpia
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.documentId;
    result.unitid   = param.documentId;

  } else if (/^\/viewer\/(medaBody|action-log)/i.test(path)) {
    // http://www.krpia.co.kr:80/viewer/medaBody?viewModeType=185002%2C&node-id=NODE04264940&plctId=PLCT00004468
    // http://www.krpia.co.kr:80/viewer/action-log?plctId=PLCT00004468&year=2019&month=9&day=12
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = param.plctId;
    result.unitid   = param['node-id'] || param.plctId;

  }

  return result;
});
