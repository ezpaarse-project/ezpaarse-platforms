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
  let result   = {};
  let pathname = parsedUrl.pathname;
  let param    = parsedUrl.query || {};
  let match;

  if ((match = /^\/DBPRO\/[a-z]{2}\/AdvancedSearch\/html\/getForm/i.exec(pathname)) !== null) {
    // /DBPro/fr/AdvancedSearch/html/getForm/se_rech/20170407-prod-2392-58e7668d6e9ee4-75323819
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (param.page === 'Dbpro.Controller.SearchResultEditor') {
    // ?page=Dbpro.Controller.SearchResultEditor&action=search&dbpc=se_rev_editor&lang=FR&uniqid=20170310-prod-5097-58c27ee91135e0-21376885
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/DBPRO\/[a-z]{2}\/Search(?:ResultEditor)?\/html\/[a-z]+\/([a-z_]+)\/([0-9a-z\-_.~]+)\/?/i.exec(pathname)) !== null) {
    // /DBPro/FR/Search/html/breadcrumb/se_src_publ_jur/jur_int_oit/1/20170407-prod-6142-58e762ea352ad7-37590738
    // /DBPro/FR/Search/html/breadcrumb/se_legi_chrono/CHRONO_2135547/1/20170323-prod-5694
    // /DBPro/FR/Search/html/breadcrumb/se_src_publ_leg/leg_eur_jo_3_20170325_80/1/20170327-prod-7054-58d90a3b70c6c2-00242421
    // /DBPro/FR/Search/html/breadcrumb/se_rev/cde_2016_2-fr/1/20170224-prod-8734-58b03390e77bd1-96126853
    // /DBPro/fr/Search/html/breadcrumb/se_rev/cde-fr/1/20170224-prod-8118-58b038c6159888-86052700
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

    let idMatch;
    if (match[1] === 'se_mono' && (idMatch = /^([a-z0-9]+)/i.exec(match[2]))) {
      result.title_id = idMatch[1];
    } else if (match[1] === 'se_rev' && (idMatch = /^((?:_?[a-z]+)+)/i.exec(match[2]))) {
      result.title_id = idMatch[1];
    } else {
      result.title_id = match[2];
    }

  } else if ((match = /^\/DBPRO\/[a-z]{2}\/Document\/html\/getDocFromDbpro\/([a-z_]+)\/([0-9a-z\-_.~]+)\/?/i.exec(pathname)) !== null) {
    // /DBPro/FR/Document/html/getDocFromDbpro/se_src_publ_jur/epo_D0016_16/0/20170407-prod-8670-58e7709a503e47-24424947
    // /DBPro/FR/Document/html/getDocFromDbpro/se_src_publ_leg/ojeu_2017.080.01.0001.01/0/20170327-prod-6774-58d919d2d7cb68-36251222
    // /DBPro/FR/Document/html/getDocFromDbpro/se_legi_chrono/DirParleuretCons-20161214-Art1~1/0/20170323-prod-4179-58d3d73d46a4a9-81798019
    // /DBPro/FR/Document/html/getDocFromDbpro/se_legi/ACT_LV_678066-19570325-Art1/0/20170323-prod-5871-58d3ce05ce7744-49426366
    // /DBPro/FR/Document/html/getDocFromDbpro/se_mono/10YEREG_003/0/20170310-prod-2861-58c288eaac2c57-38109236
    // /DBPro/FR/Document/html/getDocFromDbpro/se_rev/cde2016_2p449/0/20170224-prod-1791-58b03dedd69f62-95037418
    result.mime   = 'HTML';
    result.unitid = match[2];

    switch (match[1]) {
    case 'se_legi':
      result.rtype = 'BOOK_SECTION';
      break;
    case 'se_src_publ_jur':
      result.rtype = 'JURISPRUDENCE';
      break;
    case 'se_mono':
      result.rtype = 'BOOK_SECTION';
      if ((match = /^([a-z0-9]+)/i.exec(match[2]))) {
        result.title_id = match[1];
      }
      break;
    case 'se_rev':
      result.rtype = 'ARTICLE';
      if ((match = /^((?:_?[a-z]+)+)/i.exec(match[2]))) {
        result.title_id = match[1];
      }
      break;
    default:
      result.rtype = 'ARTICLE';
    }

  } else if ((match = /^\/[a-z]{2,3}\/se_src_publ_([a-z_]+)(?:\/search\/([a-z0-9_]+))?$/i.exec(pathname)) !== null) {
    // /fr/se_src_publ_leg_eur_jo?docEtiq=ojeu_2018.227.01.0001.01
    // /fr/se_src_publ_leg_eur_jo/search/leg_eur_jo_3

    if (param.docEtiq) {
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.unitid   = param.docEtiq;
      result.title_id = match[1];
    } else {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
      if (match[2]) {
        result.unitid   = match[2];
        result.title_id = match[1];
      }
    }

  } else if ((match = /^\/[a-z]{2,3}\/se_rev\/search\/(([a-z]+)(-[a-z]{2,3})?)$/i.exec(pathname)) !== null) {
    // /fr/se_rev/search/cde-fr
    // /fr/se_rev/search/cde-fr?docEtiq=cde2018_1p3
    if (param.docEtiq) {
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
      result.unitid   = param.docEtiq;
      result.title_id = match[2];

      const idMatch = /^[a-z]+([0-9]{4})_([0-9]+)p([0-9]+)$/i.exec(param.docEtiq);
      if (idMatch) {
        result.publication_date = idMatch[1];
        result.vol = idMatch[2];
        result.first_page = idMatch[3];
      }
    } else {
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
      result.unitid   = match[1];
      result.title_id = match[2];
    }

  } else if ((match = /^\/[a-z]{2,3}\/se_legi_chrono(?:\/macrodocument|_macro\/search)\/([a-z0-9_-]+)$/i.exec(pathname)) !== null) {
    // /fr/se_legi_chrono/macrodocument/CHRONO_2286452
    // /fr/se_legi_chrono_macro/search/se_legi_chrono_2008-fr
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]{2,3}\/(se_[a-z_]+)\/search\/([a-z0-9_-]+)$/i.exec(pathname)) !== null) {
    // /fr/se_legi_macro/search/NODE_1099835-fr?docEtiq=IMPUT_2131899
    // /fr/se_legi_chrono_macro/search/se_legi_chrono_2008-fr
    // /fr/se_mono/search/TRACOENEUR
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
    result.unitid = param.docEtiq || match[2];

    if (match[1] === 'se_rev' || match[1] === 'se_mono') {
      const idMatch = /^([a-z]+)/i.exec(match[2]);
      if (idMatch) {
        result.title_id = idMatch[1];
      }
    }

  } else if ((match = /^\/[a-z]{2,3}\/se_src_publ_(jur|jur_int)\/search\/(jur|jur_int)\/[a-z0-9:_-]+$/i.exec(pathname)) !== null) {
    // /fr/se_src_publ_jur_int/search/jur_int/f97b93090733da659a07b9ca17b0643fd9a8521c18a331d2c800cbd346b145cf::1?docEtiq=cedh_34105-03_001-188687
    // /fr/se_src_publ_jur/search/jur/275bfa3503dc13a2bb17077e1e3c369a4edb66cd611826c4862d0fc87e9d2f78::1?docEtiq=epo_T1293_18
    if (param.docEtiq) {
      result.rtype  = 'JURISPRUDENCE';
      result.mime   = 'HTML';
      result.unitid = param.docEtiq;
    } else {
      result.rtype = 'SEARCH';
      result.mime  = 'HTML';
    }

  } else if ((match = /^\/[a-z]{2,3}\/se_legi\/macrodocument\/[a-z0-9_]+\/([a-z0-9_-]+)$/i.exec(pathname)) !== null) {
    // /fr/se_legi/macrodocument/IMPUT_2156676/IMPUT_2156676-Commentairesurlesprincipesessentielsdel-avocateuropeen
    result.rtype = 'CODE_JURIDIQUE';
    result.mime  = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]{2,3}\/se_legi_chrono\/macrodocument\/[a-z0-9_]+\/doc\/([a-z0-9_~-]+)$/i.exec(pathname)) !== null) {
    // /fr/se_legi_chrono/macrodocument/CHRONO_2286452/doc/DirParleuretCons-20181023-Art1~1
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]{2,3}\/se_mono\/toc\/([a-z]+)\/doc\/([a-z0-9_]+)$/i.exec(pathname)) !== null) {
    // /fr/se_mono/toc/TRACOENEUR/doc/TRACOENEUR_002
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.title_id = match[1];

  } else if ((match = /^\/[a-z]{2,3}\/(se_[a-z_]+)$/i.exec(pathname)) !== null) {
    // /fr/se_news
    // /fr/se_encyclopedie
    // /fr/se_src_publ_jur_int
    // /fr/se_rev_editor
    // /fr/se_rep_dr_eur_mat?docEtiq=ENCY_EUR_RUB000001_BIBLIO_2012_06

    if (match[1] === 'se_rep_dr_eur_mat' && param.docEtiq) {
      result.rtype  = 'ENCYCLOPAEDIA_ENTRY';
      result.mime   = 'HTML';
      result.unitid = param.docEtiq;
    } else {
      result.rtype = 'SEARCH';
      result.mime  = 'HTML';
    }

  } else if (/^\/[a-z]{2,3}$/i.test(pathname)) {
    // /fr
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
