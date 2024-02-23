#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

function getMetadata(parameter) {
  let matchMetadata;
  if ((matchMetadata = /^([a-z0-9]+)\/(\d{4})\/(\d{4})(\d{2})\/[0-9]+$/i.exec(parameter)) !== null) {
    //dq4hdtib/2023/003201/008
    return matchMetadata;
  }
}

/**
 * Recognizes the accesses to the platform Medical Online Library
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

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/(index|library)\/(search|ebooks)(?:\/(result|search))?$/i.test(path)) {
    // https://pha.medicalonline.jp/index/search?searchtarget=2&from=form_simple&from=form_option&criteria=ibuprofen&perpage_=10&is_iryouyaku_=1&is_iryo_zaikei_naiyou_=1&is_iryo_zaikei_gaiyou_=1&is_iryo_zaikei_chusya_=1&is_iryo_zaikei_shika_=1&is_shouhin_mei_=1&is_ippan_mei_=1&is_tekiou_sikkanmei_=1
    // https://dev.medicalonline.jp/index/search?searchtarget=3&criteria=heart&perpage=10&accepted=0&accepted=1&unaccepted=0&unaccepted=1&maker_id=&from=form
    // https://mol.medicalonline.jp/library/search/result?from=form_simple&query=dog&num=20&UserID=13.236.81.23
    // https://mol.medicalonline.jp/library/ebooks/search?from=form_simple&purchased=0&query=medicine&num=20&UserID=13.236.81.23
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/tenpu_html\/iryouyaku\/([0-9a-z]+)\.htm$/i.exec(path)) !== null) {
    // https://pha.medicalonline.jp/tenpu_html/iryouyaku/dat1149001F2214.htm
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/library\/archive\/[search|select]/i.test(path)) {
    // https://mol.medicalonline.jp/library/archive/search?jo=di4aatex&ye=2022&vo=27&issue=1&UserID=13.236.81.23
    // https://mol.medicalonline.jp/library/archive/select?jo=di4aatex&UserID=13.236.81.23
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = param.jo;
    result.unitid = param.jo;
    if (param.ye) {
      result.publication_date = param.ye;
    }
    if (param.vo) {
      result.vol = param.vo;
    }
    if (param.issue) {
      result.issue = param.issue;
    }
  } else if (/^\/library\/journal\/abstract/i.test(path)) {
    // https://mol.medicalonline.jp/library/journal/abstract?GoodsID=dq4hdtib/2023/003201/008&name=0057-0066e&UserID=13.236.81.23
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.title_id = param.GoodsID.split('/')[0];
    result.unitid = param.GoodsID;
    let metadata = getMetadata(param.GoodsID);
    result.title_id = metadata[1];
    result.publication_date = metadata[2];
    result.vol = metadata[3];
    result.issue = metadata[4];
    result.first_page = param.name.split('-')[0];
    result.last_page = param.name.split('-')[1].slice(0, -1);
  } else if (/^\/library\/journal\/download/i.test(path)) {
    // https://mol.medicalonline.jp/library/journal/download?GoodsID=dq4hdtib/2019/002801/001&name=0001-0006e&UserID=13.236.81.23
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = param.GoodsID;
    let metadata = getMetadata(param.GoodsID);
    result.title_id = metadata[1];
    result.publication_date = metadata[2];
    result.vol = metadata[3];
    result.issue = metadata[4];
    result.first_page = param.name.split('-')[0];
    result.last_page = param.name.split('-')[1].slice(0, -1);
  }
  return result;
});
