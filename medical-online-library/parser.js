#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Medical Online Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/(index|library)\/(search|ebooks)(?:\/(result|search))?$/i.test(path)) {
    // https://pha.medicalonline.jp/index/search?searchtarget=2&from=form_simple&from=form_option&criteria=ibuprofen&perpage_=10&is_iryouyaku_=1&is_iryo_zaikei_naiyou_=1&is_iryo_zaikei_gaiyou_=1&is_iryo_zaikei_chusya_=1&is_iryo_zaikei_shika_=1&is_shouhin_mei_=1&is_ippan_mei_=1&is_tekiou_sikkanmei_=1
    // https://dev.medicalonline.jp/index/search?searchtarget=3&criteria=heart&perpage=10&accepted=0&accepted=1&unaccepted=0&unaccepted=1&maker_id=&from=form
    // https://mol.medicalonline.jp/library/search/result?from=form_simple&query=dog&num=20&UserID=13.236.81.23
    // https://mol.medicalonline.jp/library/ebooks/search?from=form_simple&purchased=0&query=medicine&num=20&UserID=13.236.81.23
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/tenpu_html\/iryouyaku\/([0-9a-z]+)\.htm$/i.exec(path)) !== null) {
    // https://pha.medicalonline.jp/tenpu_html/iryouyaku/dat1149001F2214.htm
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
