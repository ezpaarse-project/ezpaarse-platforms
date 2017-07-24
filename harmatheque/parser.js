#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/playebook\/(([a-z0-9_-]+?)(-[0-9]+)?)$/i.exec(path)) !== null) {
    // https://www.harmatheque.com/playebook/le-hitopadesha-recueil-de-contes-de-l-inde-ancienne
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else   if ((match = /^\/downloadebook\/(([a-z0-9_-]+?)(-[0-9]+)?)$/i.exec(path)) !== null) {
    // http://www.harmatheque.com/downloadebook/la-socionalyse-narrative-theorie-critique-et-pratique-du-changement-social-42310
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/downloadepub\/(([a-z0-9_-]+?)(-[0-9]+)?)$/i.exec(path)) !== null) {
    // http://www.harmatheque.com/downloadepub/apprendre-dans-les-reseaux-de-pme-le-role-des-contacts-personnels-41598
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/playepub\/(([a-z0-9_-]+?)(-[0-9]+)?)$/i.exec(path)) !== null) {
    // http://www.harmatheque.com/playepub/apprendre-dans-les-reseaux-de-pme-le-role-des-contacts-personnels-41598
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if ((match = /^\/pdfswf\/livre\.asp$/.exec(path)) !== null) {
    // http://pdf.harmattan.fr/pdfswf/livre.asp?idbook=776436cb79d84789b054729000dc3b58&imc=1&isbn=9782343006932
    result.rtype            = 'BOOK';
    result.mime             = 'PDF';
    result.title_id         = parsedUrl.query.isbn;
    result.unitid           = parsedUrl.query.idbook;
    result.print_identifier = parsedUrl.query.isbn;

  } else if ((match = /^\/ebook\/(([a-z0-9_-]+?)(-[0-9]+)?)$/i.exec(path)) !== null) {
    // http://www.harmatheque.com/ebook/migrations--decentralisation-et-cooperation-decentralisee-enjeux-et-perspectives-54119
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];

  } else if (/^\/rechercheavancee\/result$/i.test(path)) {
    // http://www.harmatheque.com/rechercheavancee/result
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if (/^\/advanced$/i.test(path)) {
    // http://www.harmatheque.com/advanced
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});

