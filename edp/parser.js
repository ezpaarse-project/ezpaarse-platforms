#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var param  = parsedUrl.query || {};
  var url    = parsedUrl.href;
  var match;

  var domain = parsedUrl.hostname;
  result.title_id = domain;

  // if a param url is here, take it, else it's the path
  if (param.url) { url = param.url; }

  if (param.option === 'com_journals') {
    // http://publications.edpsciences.org/index.php?option=com_journals
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
    result.unitid = param.option;

  } else if ((match = /\/articles\/\w+\/(abs|full_html|pdf|ref)\/([0-9]{4}\/[0-9]{2}|first)\/([\w\-]+)(?:\/[\w\-]+)?\.[a-z]{2,4}$/.exec(url)) !== null) {
    // /articles/apido/abs/2010/06/contents/contents.html
    // /articles/apido/abs/2010/06/m08176/m08176.html
    // /articles/medsci/full_html/2013/09/medsci2013298-9p765/F2.html
    // /articles/apido/pdf/2010/06/m08176.pdf

    if (match[2] !== 'first') {
      result.publication_date = match[2].substr(0, 4);
    }

    if (match[3] === 'contents') {
      result.unitid = domain;
      result.rtype  = 'TOC';
      result.mime   = 'MISC';
      return result;
    }

    result.unitid = `${domain}/${match[3]}`;

    switch (match[1].toLowerCase()) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'MISC';
      break;
    case 'full_html':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'ref':
      result.rtype = 'REF';
      result.mime  = 'MISC';
      break;
    }

  } else if ((match = /\/action\/display([a-zA-Z]+)/.exec(url)) !== null) {
    // http://www.epjap.org/action/displayJournal?jid=JAP
    // http://www.epjap.org/action/displayFulltext?type=1&pdftype=1&fid=8820898&jid=JAP&volumeId=61&issueId=01&aid=8820896
    // http://www.epjap.org/action/displayFulltext?type=8&fid=8820897&jid=JAP&volumeId=61&issueId=01&aid=8820896
    // http://www.epjap.org/action/displayAbstract?fromPage=online&aid=8820896&fulltextType=RA&fileId=S1286004212303182

    result.unitid = domain;

    if (param.aid) {
      result.unitid = `${domain}/${param.aid}`;
    }
    if (param.fileId) {
      result.print_identifier = `${param.fileId.substr(1, 4)}-${param.fileId.substr(5, 4)}`;
    }

    switch (match[1].toLowerCase()) {
    case 'journal':
      result.rtype  = 'TOC';
      result.mime   = 'MISC';
      break;
    case 'fulltext':
      result.rtype = param.pdftype ? 'ARTICLE' : 'REF';
      result.mime  = param.pdftype ? 'PDF' : 'MISC';
      break;
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'MISC';
      break;
    default:
      return {};
    }
  } else {
    return {};
  }

  return result;
});
