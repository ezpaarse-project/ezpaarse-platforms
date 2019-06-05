#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform InfoWeb Readex
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

  if (/^\/apps\/news\/results$|issue-browse$|hot-topics|readex\/results$/i.test(path)) {
  // https://infoweb.newsbank.com:443/apps/news/results?p=WORLDNEWS&fld-base-0=alltext&sort=YMD_date%3AD&maxresults=20&val-base-0=rainbow&t=product%3AAWNB
  // https://infoweb.newsbank.com:443/apps/news/issue-browse?p=WORLDNEWS&t=pubname%3AAEA5%21Albany%2BExaminer%2B%2528GA%2529/year%3A2016%212016/mody%3A0216%21February%2B16&action=browse&format=text
  // https://infoweb.newsbank.com:443/apps/news/hot-topics/science%2C-technology-%26-health?p=Hottopics&pnews=WORLDNEWS    
  // https://infoweb.newsbank.com:443/apps/readex/results?p=ARDX&fld-base-0=alltext&val-base-0=honeysuckle&sort=_rank_%3AD&val-database-0=&fld-database-0=database
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/iw-search\/we\/(Static\/|HistArchive)$/i.test(path)) {
  // https://infoweb.newsbank.com:443/iw-search/we/Static/?p_product=Earth&f_location=earth&p_theme=current&p_action=list&p_nbid=O67S53VOMTU1NjEwOTk5Ny44ODI2Mzg6MToxNToxNzAuMTQwLjE0Mi4yNTI
  // http://infoweb.newsbank.com:80/iw-search/we/HistArchive?p_action=search
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((/^\/apps\/news\/document-view|iw-search\/we\/HistArchive\/|apps\/readex\/doc$/i.exec(path)) !== null) {
  // https://infoweb.newsbank.com:443/apps/news/document-view?p=WORLDNEWS&t=product%3AAWNB/stp%3ABlog%21Blog&sort=YMD_date%3AD&fld-base-0=alltext&maxresults=20&val-base-0=rainbow&docref=news/172FFE5E4D54A8A0    
  // http://infoweb.newsbank.com:80/iw-search/we/HistArchive/?p_product=FBISX&p_theme=fbis&p_nbid=M5CA58XSMTU1NzQzMzAzNi4zOTMzMDE6MToxNToxNzAuMTQwLjE0Mi4yNTI&p_action=doc&s_lastnonissuequeryname=1&p_queryname=1&p_docref=v2:12895BC6AA32DB40@FBISX-13540E2F54E71300@2432788-13540E7456186328@148&p_docnum=1
  // https://infoweb.newsbank.com:443/apps/readex/doc?p=ARDX&sort=_rank_%3AD&fld-base-0=alltext&val-base-0=honeysuckle&val-database-0=&fld-database-0=database&docref=image/v2%3A11342729F00F3900%40EANX-11580B8C962C3948%402422147-11580B8EDCEC28D8%405-11580B91A5AF7218%40Wild%2BHoneysuckle&firsthit=yes
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.docref || param.p_docref;
    result.title_id = param.docref || param.p_docref;

  } else if ((/^\/iw-search\/we\/Static$/i.exec(path)) !== null) {
  //https://infoweb.newsbank.com:443/iw-search/we/Static?p_product=Earth&f_location=earth&p_theme=current&p_action=doc&p_nbid=O67S53VOMTU1NjEwOTk5Ny44ODI2Mzg6MToxNToxNzAuMTQwLjE0Mi4yNTI&f_docnum=172F8EE719450268&f_topic=1&f_prod=BTI2&f_type=&d_refprod=SPECIALREPORTS
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.f_docnum;
    result.title_id = param.f_docnum;

  } else if ((/^\/SiteLinks\/imageviewer\/([A-z]+)\/index.xml$/i.exec(path)) !== null) {
    // http://infoweb.newsbank.com:80/SiteLinks/imageviewer/toc/index.xml?ssl=true&url=v2%3A12895BC6AA32DB40%40FBISX-13540E2F54E71300%402432788-13540E7456186328%40148&query=potato&xslt=toc_osd
    // http://infoweb.newsbank.com:80/SiteLinks/imageviewer/download_pdf/index.xml?ssl=true&format=pdf&rem=webengine_fbis&url=v2%3A11C33B0D5F860D98%40FBISX-12271CC0B07B0E78%402444646-12271CD366174438%4061
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.url;
    result.title_id = param.url;
  }

  return result;
});
