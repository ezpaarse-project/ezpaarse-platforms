#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Irish Newspaper Archives
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
  let hash = parsedUrl.hash;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/olive\/([a-z]+)\/INA\.Edu\/Default\.aspx$/i.test(path) && hash.includes('search') == true) {
    // https://archive.irishnewsarchive.com/olive/APA/INA.Edu/Default.aspx#panel=search&search=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/olive\/([a-z]+)\/INA\.Edu\/SharedView\.Article\.aspx$/i.test(path) && param.viewMode == 'image') {
    // https://archive.irishnewsarchive.com/olive/APA/INA.Edu/SharedView.Article.aspx?href=WNL%2F1909%2F01%2F09&id=Ar00300&sk=71A559EE&viewMode=image
    // Ar00103;IMAGE;HTML;https://archive.irishnewsarchive.com/olive/APA/INA.Edu/SharedView.Article.aspx?href=NGD%2F1867%2F05%2F29&id=Ar00103&sk=95587843&viewMode=image
    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
    result.title_id = param.href.substring(0, param.href.indexOf('/'));
    result.publication_date = param.href.substring(param.href.indexOf('/')+1);
    result.unitid   = param.id;
  } else if (/^\/olive\/([a-z]+)\/INA\.Edu\/Default\.aspx$/i.test(path) && hash.includes('document') == true) {
    // https://archive.irishnewsarchive.com/olive/APA/INA.Edu/Default.aspx#panel=document
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
  }

  return result;
});
