#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const abbrToRtype = new Map([
  ['abs', 'ABS'],
  ['ref', 'RECORD_VIEW'],
  ['olm', 'SUPPL'],
  ['ps', 'ARTICLE'],
  ['full', 'ARTICLE'],
  ['full_html', 'ARTICLE'],
  ['pdf', 'ARTICLE'],
  ['epub', 'ARTICLE'],
  ['epub2', 'ARTICLE'],
]);
const extToMime = new Map([
  ['html', 'HTML'],
  ['epub', 'EPUB'],
  ['pdf', 'PDF'],
  ['ps', 'POSTSCRIPT'],
]);

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let param  = parsedUrl.query || {};
  let url    = parsedUrl.pathname;
  let domain = parsedUrl.hostname;
  let match;

  // if a param url is here, take it, else it's the path
  if (param.url) { url = param.url; }

  if (param.option === 'com_journals') {
    // http://publications.edpsciences.org/index.php?option=com_journals
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if ((match = /(?:\/[a-z]{2})?\/articles\/(\w+)\/([\w_]+)\/(([0-9]{4})\/[0-9]{2}|first|forth)\/([\w-]+?)(?:\/[\w-]+?)?(_online)?\.([a-z]{2,4})$/.exec(url)) !== null) {
    // /articles/apido/abs/2010/06/contents/contents.html
    // /articles/apido/abs/2010/06/m08176/m08176.html
    // /articles/medsci/full_html/2013/09/medsci2013298-9p765/F2.html
    // /articles/apido/pdf/2010/06/m08176.pdf
    // /articles/sm/olm/first/sm190053/sm190053.html
    // /articles/aa/pdf/forth/aa40837-21.pdf
    // /articles/aa/full/2006/02/aa3316-05/aa3316-05_online.html

    if (match[4]) {
      result.publication_date = match[4];
    }

    if (match[5] === 'contents') {
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.unitid   = match[1];
      result.title_id = match[1];
      return result;
    }

    result.unitid   = match[5];
    result.title_id = match[1];
    result.rtype    = abbrToRtype.get(match[6] ? 'olm' : match[2].toLowerCase());
    result.mime     = extToMime.get(match[7].toLowerCase());

  } else if ((match = /\/action\/display([a-zA-Z]+)/.exec(url)) !== null) {
    // http://www.epjap.org/action/displayJournal?jid=JAP
    // http://www.epjap.org/action/displayFulltext?type=1&pdftype=1&fid=8820898&jid=JAP&volumeId=61&issueId=01&aid=8820896
    // http://www.epjap.org/action/displayFulltext?type=8&fid=8820897&jid=JAP&volumeId=61&issueId=01&aid=8820896
    // http://www.epjap.org/action/displayAbstract?fromPage=online&aid=8820896&fulltextType=RA&fileId=S1286004212303182

    result.unitid = domain;
    result.title_id = domain;

    if (param.aid) {
      result.unitid = `${domain}/${param.aid}`;
    }
    if (param.fileId) {
      result.print_identifier = `${param.fileId.substr(1, 4)}-${param.fileId.substr(5, 4)}`;
    }
    if (/^\d+$/.test(param.volumeId)) {
      result.vol = param.volumeId;
    }
    if (/^\d+$/.test(param.issueId)) {
      result.issue = param.issueId;
    }

    switch (match[1].toLowerCase()) {
    case 'journal':
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      break;
    case 'fulltext':
      result.rtype = param.pdftype ? 'ARTICLE' : 'RECORD_VIEW';
      result.mime  = param.pdftype ? 'PDF' : 'HTML';
      break;
    case 'abstract':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    }
  }

  return result;
});
