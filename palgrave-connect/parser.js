#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};

  var path        = parsedUrl.pathname;
  var pathSplited = path.split('/');

  var match;
  var doiSplited;

  if ((match = /^\/pc\/doifinder\/([0-9\\.]+)\/([0-9]+)$/.exec(path)) !== null) {
    // https://www.palgraveconnect.com/pc/doifinder/10.1057/9781137298881
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.doi              = match[1] + '/' + match[2];
    result.print_identifier = match[2];
    result.unitid           = match[1] + '/' + match[2];
  } else if (pathSplited[3] == 'browse' && pathSplited[4] == 'inside' && pathSplited[5] == 'chapter') {
    // https://www.palgraveconnect.com/pc/polintstud2013/browse/inside/chapter/9781137298881/9781137298881.0001.html?chapterDoi=9781137298881.0001#page=0
    // 9781137298881;9781137298881.0001;BOOK_SECTION;HTML;
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'HTML';
    result.doi              = parsedUrl.query['chapterDoi'];
    result.print_identifier = pathSplited[6] ? pathSplited[6] : undefined;
    result.unitid           = pathSplited[5] + '/' + pathSplited[6];

  } else if (pathSplited[3] == 'browse' && pathSplited[4] == 'inside' && pathSplited[5] == 'download' && pathSplited[6] == 'chapter') {
    // https://www.palgraveconnect.com/pc/polintstud2013/browse/inside/download/chapter/9781137298881.0009/9781137298881.0009.pdf&chapterDoi=9781137298881.0009
    // 9781137298881;9781137298881.0009;BOOK_SECTION;PDF
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'PDF';
    result.doi              = pathSplited[7] ? pathSplited[7] : undefined;
    doiSplited              = result.doi ? result.doi.split('.') : [];
    result.print_identifier = doiSplited[0] ? doiSplited[0] : undefined;
    result.unitid           = pathSplited[6] + '/' + pathSplited[7].split('.')[0];
  } else if (pathSplited[3] == 'browse' && pathSplited[4] == 'inside' && pathSplited[5] == 'download') {
    // https://www.palgraveconnect.com/pc/polintstud2013/browse/inside/download/9781137298881.pdf
    // 9781137298881;;BOOK;PDF;
    result.rtype            = 'BOOK';
    result.mime             = 'PDF';
    result.doi              = undefined;
    result.print_identifier = pathSplited[6] ? pathSplited[6].replace('.pdf', '') : undefined;
    result.unitid           = pathSplited[5] + '/' + pathSplited[6].split('.')[0];
  } else if (pathSplited[3] == 'browse' && pathSplited[4] == 'inside' && pathSplited[5] == 'epub') {
    // https://www.palgraveconnect.com/pc/polintstud2013/browse/inside/epub/9781137298881.epub
    // 9781137298881;;BOOK;EPUB;
    result.rtype            = 'BOOK';
    result.mime             = 'EPUB';
    result.doi              = undefined;
    result.print_identifier = pathSplited[6] ? pathSplited[6].replace('.epub', '') : undefined;
    result.unitid           = pathSplited[5] + '/' + pathSplited[6].replace('.epub', '');
  } else if (pathSplited[2] == 'browse' && pathSplited[3] == 'sendToKindle') {
    // https://www.palgraveconnect.com/pc/browse/sendToKindle?doi=10.1057/9781137298881
    // 9781137298881;10.1057/9781137298881;BOOK;KINDLE;
    result.rtype            = 'BOOK';
    result.mime             = 'KINDLE';
    result.doi              = parsedUrl.query['doi'];
    doiSplited              = result.doi ? result.doi.split('/') : [];
    result.print_identifier = doiSplited[1] ? doiSplited[1] : undefined;
    result.unitid           = parsedUrl.query['doi'];
  } else if (pathSplited[1] == 'articles') {
    // http://www.readcube.com/articles/10.1057/9781137298881
    // 9781137298881;10.1057/9781137298881;BOOK;PDF;
    result.rtype            = 'BOOK';
    result.mime             = 'PDF';
    result.doi              = (pathSplited[2] && pathSplited[3]) ? pathSplited[2] + '/' + pathSplited[3] : '';
    result.print_identifier = pathSplited[3] ? pathSplited[3] : undefined;
    result.unitid           = (pathSplited[2] && pathSplited[3]) ? pathSplited[2] + '/' + pathSplited[3] : '';
  }

  return result;
});

