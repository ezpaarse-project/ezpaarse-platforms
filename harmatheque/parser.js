#!/usr/bin/env node

// ##EZPAARSE
// very simple skeleton parser

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};

  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/playebook\/(.+)$/.exec(path)) !== null) {
    // https://www.harmatheque.com/playebook/le-hitopadesha-recueil-de-contes-de-l-inde-ancienne

    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1].replace(new RegExp('-[0-9]+$'), '');
    result.unitid   = match[1];
  } else   if ((match = /^\/downloadebook\/(.+)$/.exec(path)) !== null) {
    // http://www.harmatheque.com/downloadebook/la-socionalyse-narrative-theorie-critique-et-pratique-du-changement-social-42310

    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1].replace(new RegExp('-[0-9]+$'), '');
    result.unitid   = match[1];
  } else if ((match = /^\/downloadepub\/(.+)$/.exec(path)) !== null) {
    // http://www.harmatheque.com/downloadepub/apprendre-dans-les-reseaux-de-pme-le-role-des-contacts-personnels-41598

    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.title_id = match[1].replace(new RegExp('-[0-9]+$'), '');
    result.unitid   = match[1];
  } else if ((match = /^\/playepub\/(.+)$/.exec(path)) !== null) {
    // http://www.harmatheque.com/playepub/apprendre-dans-les-reseaux-de-pme-le-role-des-contacts-personnels-41598

    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
    result.title_id = match[1].replace(new RegExp('-[0-9]+$'), '');
    result.unitid   = match[1];
  } else if ((match = /^\/pdfswf\/livre/.exec(path)) !== null) {
    // http://pdf.harmattan.fr/pdfswf/livre.asp?idbook=776436cb79d84789b054729000dc3b58&imc=1&isbn=9782343006932

    result.rtype            = 'BOOK';
    result.mime             = 'PDF';
    result.title_id         = parsedUrl.query.isbn;
    result.unitid           = parsedUrl.query.idbook;
    result.print_identifier = parsedUrl.query.isbn;
  }

  return result;
});

