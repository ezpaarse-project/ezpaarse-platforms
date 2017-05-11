#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Strada Lex
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let pathname = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/DBPRO\/FR\/([a-z]+)\/html\/([a-z]+)\/([a-z\_]+)\/([0-9a-z\-\_\.\~]+)\/?/i.exec(pathname)) !== null) {
    //DBPro/fr/AdvancedSearch/html/getForm/se_rech/20170407-prod-2392-58e7668d6e9ee4-75323819
    //DBPro/FR/Search/html/breadcrumb/se_src_publ_jur/jur_int_oit/1/20170407-prod-6142-58e762ea352ad7-37590738
    //DBPro/FR/Document/html/getDocFromDbpro/se_src_publ_jur/epo_D0016_16/0/20170407-prod-8670-58e7709a503e47-24424947
    //DBPro/FR/Document/html/getDocFromDbpro/se_src_publ_leg/ojeu_2017.080.01.0001.01/0/20170327-prod-6774-58d919d2d7cb68-36251222
    //DBPro/FR/Document/html/getDocFromDbpro/se_legi_chrono/DirParleuretCons-20161214-Art1~1/0/20170323-prod-4179-58d3d73d46a4a9-81798019
    //DBPro/FR/Search/html/breadcrumb/se_legi_chrono/CHRONO_2135547/1/20170323-prod-5694
    //DBPro/FR/Search/html/breadcrumb/se_src_publ_leg/leg_eur_jo_3_20170325_80/1/20170327-prod-7054-58d90a3b70c6c2-00242421
    //DBPro/FR/Document/html/getDocFromDbpro/se_legi/ACT_LV_678066-19570325-Art1/0/20170323-prod-5871-58d3ce05ce7744-49426366
    //DBPro/FR/Document/html/getDocFromDbpro/se_mono/10YEREG_003/0/20170310-prod-2861-58c288eaac2c57-38109236
    result.mime = 'HTML';

    switch (match[1]) {
    case 'AdvancedSearch':
      result.rtype = 'SEARCH';
      break;
    case 'Search':
      result.title_id = match[4];
      result.rtype = 'SEARCH';
      break;
    case 'Document':
      result.unitid = match[4];
      result.rtype = 'ARTICLE';

      switch (match[3]) {
      case 'se_legi':
        result.rtype = 'BOOK_SECTION';
        break;
      case 'se_mono':
        result.rtype = 'BOOK_SECTION';
        break;
      case 'se_src_publ_jur':
        result.rtype = 'JURISPRUDENCE';
        break;
      }

      break;
    case 'SearchResultEditor':
      result.title_id = match[4];
      result.rtype = 'SEARCH';
      break;
    default:
      break;
    }
  } else if ((match = /^\/DBPRO\/FR\/home\/html$/i.exec(pathname)) !== null) {
    // https://www.stradalex.eu/DBPro/FR/Home/html
    result.rtype = 'OTHER';
    result.mime = 'HTML';
  }

  if (param.page == 'Dbpro.Controller.SearchResultEditor') {
    //?page=Dbpro.Controller.SearchResultEditor&action=search&dbpc=se_rev_editor&lang=FR&uniqid=20170310-prod-5097-58c27ee91135e0-21376885
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
