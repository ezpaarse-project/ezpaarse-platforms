#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let param  = parsedUrl.query || {};
  let path   = parsedUrl.pathname;
  let match;

  if (path === '/numero.php') {
    // example: http://www.cairn.info/numero.php?ID_REVUE=ARSS&ID_NUMPUBLIE=ARSS_195&AJOUTBIBLIO=ARSS_195_0012
    if (param.ID_REVUE) {
      result.title_id = param.ID_REVUE;
      result.unitid   = param.AJOUTBIBLIO;
    }
  } else if (/^\/load_pdf(_do_not_index)?.php$/i.test(path)) {
    // /load_pdf.php?ID_ARTICLE=ARSS_195_0012
    // /load_pdf.php?ID_ARTICLE=ERES_DUMEZ_2003_01_0009
    // /load_pdf_do_not_index.php?ID_ARTICLE=EH_084_0077
    if (param.ID_ARTICLE) {
      result.unitid = param.ID_ARTICLE;

      if ((match = /[A-Z]+/.exec(param.ID_ARTICLE.split('_')[1])) !== null) {
        //case of a book section pdf event
        result.rtype = 'BOOK_SECTION';
        result.mime  = 'PDF';

        let split = param.ID_ARTICLE.split('_');
        result.title_id = split[0] + '_' +
                          split[1] + '_' +
                          split[2] + '_' +
                          split[3];
      } else {
        // case of journal article
        // title_id is the first part of ID_ARTICLE ("_" character is the separator)
        result.title_id = param.ID_ARTICLE.split('_')[0];
        result.rtype = 'ARTICLE';
        result.mime = 'PDF';
      }
    }
  } else if (path === '/resume.php') {
    // example: http://www.cairn.info/resume.php?ID_ARTICLE=ARSS_195_0012
    result.rtype = 'ABS';
    result.mime  = 'HTML';

    if (param.ID_ARTICLE) {
      // title_id is the first part of ID_ARTICLE ("_" character is the separator)
      result.title_id = param.ID_ARTICLE.split('_')[0];
      result.unitid   = param.ID_ARTICLE;
    }
  } else if (/^\/(article|zen)\.php$/i.test(path)) {
    // https://www.cairn.info/article.php?ID_ARTICLE=VING_108_0003
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';

    if (param.ID_ARTICLE) {
      // title_id is the first part of ID_ARTICLE ("_" character is the separator)
      result.title_id = param.ID_ARTICLE.split('_')[0];
      result.unitid   = param.ID_ARTICLE;
    }
  } else if (path === '/feuilleter.php') {
    // leaf-through a book section, in a flash player
    // example: http://www.cairn.info/feuilleter.php?ID_ARTICLE=PUF_MAZIE_2010_01_0003
    if (param.ID_ARTICLE) {
      // title_id is the concatenation of the first to the forelast part of the ID_ARTICLE parameter
      result.rtype  = 'BOOK_SECTION';
      result.mime   = 'HTML';
      result.unitid = param.ID_ARTICLE;

      let split = param.ID_ARTICLE.split('_');
      result.title_id = split[0] + '_' +
                   split[1] + '_' +
                   split[2] + '_' +
                   split[3];
    }
  } else if ((match = /^\/(((?:revue-|magazine-)[a-z0-9@-]+)-([0-9]{4})-([0-9]+)-(page|p)-([0-9]+))\.html?$/i.exec(path)) !== null) {
    // journal example: http://www.cairn.info/revue-actes-de-la-recherche-en-sciences-sociales-2012-5-page-4.htm
    result.rtype            = match[5] === 'page' ? 'ARTICLE' : 'PREVIEW';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.issue            = match[4];
    result.first_page       = match[6];

  } else if ((match = /^\/(((?:revue-|magazine-)[a-z0-9@-]+?)(?:-([0-9]{4})-([0-9]+))?)\.html?$/i.exec(path)) !== null) {
    // journal example: http://www.cairn.info/revue-a-contrario.htm
    result.unitid   = match[1];
    result.title_id = match[2];
    result.rtype    = 'TOC';
    result.mime     = 'HTML';

    if (match[3]) {
      result.publication_date = match[3];
      result.issue = match[4];
    }

  } else if ((match = /^\/(([a-z0-9 @-]+)--([0-9]{0,13})(?:-(page|p)-([0-9]+))?)\.html?$/i.exec(path)) !== null) {
    // /a-l-ecole-du-sujet--9782749202358-page-9.htm
    // /a-l-ecole-du-sujet--9782749202358-p-9.htm
    // /a-l-ecole-du-sujet--9782749202358.htm
    // /couple-conjugal-couple-parental-vers-de-nouveaux--978274920806-p-217.htm
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.title_id         = match[2];
    result.print_identifier = match[3].padEnd(match[3].length >= 11 ? 13 : 10, '0');

    if (!match[4]) {
      result.rtype = 'TOC';
    } else if (match[4] === 'page') {
      result.rtype = 'BOOK_SECTION';
      result.first_page = match[5];
    } else {
      result.rtype = 'PREVIEW';
      result.first_page = match[5];
    }
  }

  return result;
});
