#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if (/^\/rechercheavancee\/result$/i.test(path)) {
    // http://www.harmatheque.com/rechercheavancee/result
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if (/^\/advanced$/i.test(path)) {
    // http://www.harmatheque.com/advanced
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/([a-z]+)\/(([a-z0-9_-]+?)(-[0-9]+)?)$/i.exec(path)) !== null) {
    // https://www.harmatheque.com/playebook/le-hitopadesha-recueil-de-contes-de-l-inde-ancienne
    // http://www.harmatheque.com/downloadebook/la-socionalyse-narrative-theorie-critique-et-pratique-du-changement-social-42310
    // http://www.harmatheque.com/article/les_politiques_economiques_europeennes_face_a_la_grande_recession29359


    result.title_id = match[3];
    result.unitid   = match[2];

    switch (match[1]) {
    case 'playebook':
    case 'downloadebook':
      result.rtype = 'BOOK';
      result.mime  = 'PDF';
      break;
    case 'playepub':
    case 'downloadepub':
      result.rtype = 'BOOK';
      result.mime  = 'EPUB';
      break;
    case 'playvideo':
      result.rtype = 'VIDEO';
      result.mime  = 'MISC';
      break;
    case 'playaudio':
      result.rtype = 'AUDIO';
      result.mime  = 'MISC';
      break;
    case 'ebook':
    case 'article':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    default:
      return {};
    }
  } else if ((match = /^\/pdfswf\/livre\.asp$/.exec(path)) !== null) {
    // http://pdf.harmattan.fr/pdfswf/livre.asp?idbook=776436cb79d84789b054729000dc3b58&imc=1&isbn=9782343006932
    result.rtype            = 'BOOK';
    result.mime             = 'PDF';
    result.title_id         = parsedUrl.query.isbn;
    result.unitid           = parsedUrl.query.idbook;
    result.print_identifier = parsedUrl.query.isbn;

  } else if (/^\/dlp.php$/i.test(path)) {
    // http://liseuse.harmattan.fr/dlp.php?a=9782343122533&b=1470951914&c=130&d=b5a0728d5dc7160cf81e9588dffdff93&e=js&f=HTQ2a88341f5c5c0fa3ca09d899cee91d9b&r=20170725085152
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'PDF';

    if (param.a) {
      result.print_identifier = param.a;
      result.title_id         = param.a;
      result.unitid           = `${param.a}-${param.c || '0'}`;
    }

  }

  return result;
});

