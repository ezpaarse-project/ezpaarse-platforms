#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const database = require('./database.json');

/**
 * Recognizes the accesses to the platform World Book Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};
  let hash = parsedUrl.hash;

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/([a-z]+)\/search$/i.exec(path)) !== null) {
    // https://www.worldbookonline.com/advanced/search?st1=Vietnam
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
    result.db_id = match[1];
  } else if ((match = /^\/bth\/$/i.exec(path)) !== null && param.s) {
    // https://bth.worldbook.com/bth/?s=Healthcare
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/([a-z]+)\/article$/i.exec(path)) !== null) {
    // https://www.worldbookonline.com/advanced/article?id=ar585360&st=vietnam#tab=homepage
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = param.id;
    result.unitid = param.id;
    result.db_id = match[1];
  } else if ((match = /^\/([a-z]+)\/oprimarysource$/i.exec(path)) !== null) {
    // https://www.worldbookonline.com/advanced/oprimarysource?id=/advanced/EBSCOArticle?db=wph&ui=21212223&mt=ar585360
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = param.mt;
    result.unitid = param.mt;
    result.db_id = match[1];
  } else if ((match = /^\/bth\/$/i.exec(path)) !== null && param.p) {
    // https://bth.worldbook.com/bth/?p=44630
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.title_id = param.p;
    result.unitid = param.p;
  } else if ((match = /^\/image\/upload\/q_auto\/.+\/content\/([a-z]+[0-9]+).jpg$/i.exec(path)) !== null) {
    // https://media.worldbookonline.com/image/upload/q_auto/f_jpg,w_630,c_limit/content/pc305763.jpg
    result.rtype = 'IMAGE';
    result.mime = 'GIF';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/([a-z]+)\/media$/i.exec(path)) !== null && param.id) {
    // https://www.worldbookonline.com/advanced/media?id=pc367637&st=vietnam
    // https://www.worldbookonline.com/advanced/media?id=ta585360-t01&st=vietnam
    // https://www.worldbookonline.com/advanced/media?id=au032506&st=vietnam
    // https://www.worldbookonline.com/advanced/media?id=lr012597&st=vietnam

    switch (param.id.substr(0, 2)) {
    case 'pc':
      result.rtype = 'IMAGE';
      result.mime = 'GIF';
      break;

    case 'ta':
      result.rtype = 'TABLE';
      result.mime = 'HTML';
      break;

    case 'au':
      result.rtype = 'AUDIO';
      result.mime = 'MP3';
      break;

    case 'lr':
      result.rtype = 'MAP';
      result.mime = 'GIF';
      break;
    }

    result.title_id = param.id;
    result.unitid = param.id;
    result.db_id = match[1];
  } else if ((match = /^\/bth\/$/i.exec(path)) !== null && param.cat !== null) {
    // https://bth.worldbook.com/bth/?cat=468
    result.rtype = 'TOC';
    result.mime = 'HTML';
  } else if ((match = /^\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://www.worldbookonline.com/wbel/#/stories/bk000022/en-US?category=transportation
    // https://www.worldbookonline.com/wbel/#/videos/vd001246?category=weather
    // https://www.worldbookonline.com/student-new/#/search/snow%20leopard/type/ar?searchType=basicsearch
    //https://www.worldbookonline.com/student-new/#/article/home/ar319960/snow%20leopard
    result.mime = 'HTML';
    result.db_id = match[1];
    let hashMatch;
    if (/^#\/search\/.+$/i.test(hash)) {
      result.rtype = 'SEARCH';
    } else if ((hashMatch = /^#\/article\/home\/([a-z0-9]+)\/.+$/i.exec(hash)) !== null) {
      result.rtype = 'ARTICLE';
      result.title_id = hashMatch[1];
      result.unitid = hashMatch[1];
    } else if ((hashMatch = /^#\/stories\/([a-z0-9]+)\/.+$/i.exec(hash)) !== null) {
      result.rtype = 'BOOK';
      result.title_id = hashMatch[1];
      result.unitid = hashMatch[1];
    } else if ((hashMatch = /^#\/videos\/([a-z0-9]+)?.+$/i.exec(hash)) !== null) {
      result.rtype = 'VIDEO';
      result.title_id = hashMatch[1];
      result.unitid = hashMatch[1];
    }
  }

  if (result.db_id) {
    if (database[result.db_id.toLowerCase()]) {
      result.db_name = database[result.db_id.toLowerCase()];
    }
  }

  return result;
});
