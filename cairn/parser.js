#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let param  = parsedUrl.query || {};
  let match;

  if (parsedUrl.pathname === '/numero.php') {
    // example: http://www.cairn.info/numero.php?ID_REVUE=ARSS&ID_NUMPUBLIE=ARSS_195&AJOUTBIBLIO=ARSS_195_0012
    if (param.ID_REVUE) {
      result.title_id = param.ID_REVUE;
      result.unitid   = param.AJOUTBIBLIO;
    }

    if (param.AJOUTBIBLIO) {
      result.rtype  = 'BOOKMARK';
      result.mime   = 'MISC';
      result.unitid = param.AJOUTBIBLIO; // plus précis que le précédent
    }
  } else if (parsedUrl.pathname === '/load_pdf.php') {
    // journal article example: http://www.cairn.info/load_pdf.php?ID_ARTICLE=ARSS_195_0012
    // book section example: http://www.cairn.info/load_pdf.php?ID_ARTICLE=ERES_DUMEZ_2003_01_0009
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
  } else if (parsedUrl.pathname === '/resume.php') {
    // example: http://www.cairn.info/resume.php?ID_ARTICLE=ARSS_195_0012
    result.rtype = 'ABS';
    result.mime  = 'MISC';

    if (param.ID_ARTICLE) {
      // title_id is the first part of ID_ARTICLE ("_" character is the separator)
      result.title_id = param.ID_ARTICLE.split('_')[0];
      result.unitid   = param.ID_ARTICLE;
    }
  } else if (parsedUrl.pathname === '/feuilleter.php') {
    // leaf-through a book section, in a flash player
    // example: http://www.cairn.info/feuilleter.php?ID_ARTICLE=PUF_MAZIE_2010_01_0003
    if (param.ID_ARTICLE) {
      // title_id is the concatenation of the first to the forelast part of the ID_ARTICLE parameter
      result.rtype  = 'BOOK_SECTION';
      result.mime   = 'MISC';
      result.unitid = param.ID_ARTICLE;

      let split = param.ID_ARTICLE.split('_');
      result.title_id = split[0] + '_' +
                   split[1] + '_' +
                   split[2] + '_' +
                   split[3];
    }
  } else if ((match = /^\/(revue-|magazine-)([a-z0-9@-]+)(-[0-9]{4}-[0-9]+([^.]*))\.htm$/.exec(parsedUrl.pathname)) !== null) {
    // journal example: http://www.cairn.info/revue-actes-de-la-recherche-en-sciences-sociales-2012-5-page-4.htm
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + match[2] + match[3];
    result.title_id = match[1] + match[2];

    let pagexist = match[4].split('-')[1];

    if (!pagexist) {
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    } else if (pagexist === 'p') {
      result.rtype    = 'PREVIEW';
      result.mime     = 'MISC';
    }
  } else if ((match = /^\/(revue-|magazine-)([a-z0-9@-]+)\.htm$/.exec(parsedUrl.pathname)) !== null) {
    // journal example: http://www.cairn.info/revue-a-contrario.htm
    result.unitid   = match[1] + match[2];
    result.title_id = match[1] + match[2];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/([a-z0-9@-]+)--([0-9]{13})([^.]*).htm$/.exec(parsedUrl.pathname)) !== null) {
    // book example: http://www.cairn.info/a-l-ecole-du-sujet--9782749202358-page-9.htm
    // book example: http://www.cairn.info/a-l-ecole-du-sujet--9782749202358-p-9.htm
    // book example: http://www.cairn.info/a-l-ecole-du-sujet--9782749202358.htm
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1] + '--' + match[2] + match[3];
    result.print_identifier = match[2];

    let pagexist = match[3].split('-')[1];

    if (!pagexist) {
      result.rtype = 'TOC';
      result.mime  = 'MISC';
    } else if (pagexist === 'p') {
      result.rtype = 'PREVIEW';
      result.mime  = 'MISC';
    }
  }

  return result;
});
