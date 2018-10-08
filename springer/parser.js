#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  const result = {};
  const param  = parsedUrl.query || {};
  const path   = parsedUrl.pathname;
  let match;

  if ((match = /\/journal(\/volumesAndIssues)?\/([0-9]+)/.exec(path)) !== null) {
    // /journal/10696
    // /journal/volumesAndIssues/436
    result.title_id = match[2];
    result.unitid   = match[2];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/(article|book|protocol|referenceworkentry)\/(10\.[0-9]+\/([^/]+))(\/page\/[0-9]+)?(\/fulltext.html)?/.exec(path)) !== null) {
    result.doi    = match[2];
    result.unitid = match[3] + (match[4] || '');

    switch (match[1]) {
    case 'article':
      // /article/10.1007/s10696-011-9117-0/fulltext.html
      // /article/10.1007/s10696-011-9117-0
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    case 'book':
      // /book/10.1007/BFb0009075/page/1
      result.rtype = 'BOOK';
      result.mime  = 'HTML';

      if (/^\/book\/([0-9]+\.[0-9]+\/([0-9-])+)$/.test(path)) {
        // /book/10.1007/978-3-642-45082-2
        result.rtype = 'TOC';
        result.mime  = 'MISC';
        result.online_identifier = match[3];
      }
      break;
    case 'referenceworkentry':
      // /referenceworkentry/10.1007/978-3-319-01904-8_3-1
      result.rtype = 'BOOK_SECTION';
      result.mime  = 'HTML';
      break;
    case 'protocol':
      // /protocol/10.1007/978-1-61779-998-3_39
      result.rtype = 'BOOK';
      result.mime  = 'HTML';
      break;
    }

  } else if ((match = /^\/content\/pdf\/(10\.[0-9]+\/(.+?))(\.pdf)?$/.exec(path)) !== null) {
    // /content/pdf/10.1007/s00359-010-0615-4
    // /content/pdf/10.1007%2F978-3-642-45082-2.pdf

    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';

    if (/^(\d-*){13}(?![\d-])/.test(match[2])) {
      result.rtype = match[2].includes('_') ? 'BOOK_SECTION' : 'BOOK';
    }

  } else if ((match = /^\/content\/([0-9]{4}-[0-9]{4})/.exec(path)) !== null) {
    // /content/1590-4261
    result.print_identifier = match[1];
    result.unitid           = match[1];
    result.rtype            = 'TOC';
    result.mime             = 'MISC';

  } else if ((match = /^\/content\/([a-zA-Z0-9]+)(\/fulltext.pdf)?/.exec(path)) !== null) {
    // /content/1643m244v35p35n5/
    // /content/m181480225654444/fulltext.pdf
    result.unitid = match[1];
    result.rtype  = 'ABS';
    result.mime   = 'MISC';

  } else if ((match = /^\/chapter\/(([0-9]+\.[0-9]+)\/([^/]*))(\/([a-z]+)\.html)?/.exec(path)) !== null) {
    // /chapter/10.1007/978-3-540-71233-6_4
    // /chapter/10.1007/978-3-642-45082-2_1/fulltext.html
    result.doi    = match[1];
    result.unitid = match[3];
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';

  } else if ((match = /^\/(book)?series\/([0-9]+)/.exec(path)) !== null) {
    // /bookseries/7651
    // /series/7651
    result.title_id = match[2];
    result.unitid   = match[2];
    result.rtype    = 'BOOKSERIE';
    result.mime     = 'MISC';

  } else if ((match = /^\/openurl.asp/.exec(path)) !== null) {
    if (param.genre && param.genre == 'journal') {
      // /openurl.asp?genre=journal&issn=1633-8065
      if (param.issn) {
        result.print_identifier = param.issn;
        result.unitid = param.issn;
      }
      result.rtype = 'TOC';
      result.mime  = 'MISC';
    }
  } else if ((match = /^\/static\/pdf\/([0-9]+)\/([a-zA-Z]{3})([^/]+)\.pdf/.exec(path)) !== null) {
    if ((param.ext && param.ext == '.pdf') || param.token2) {
      // http://download.springer.com/static/pdf/523/
      // bfm%253A978-1-60761-847-8%252F1.pdf?auth66=1384533099_d84ec41bfb54c7ebeec4c5604109e82f&ext=.pdf
      // http://download.springer.com/static/pdf/306/art%253A10.1007%252Fs10696-011-9117-0.pdf
      // ?auth66=1384536619_eb29d0312d3611304feced658436b1ff&ext=.pdf
      // http://download.springer.com/static/pdf/814/chp%253A10.1007%252FBFb0009076.pdf?
      // auth66=1414774941_b4e319c8dc5923418d751bf57de4fdc9&ext=.pdf
      // http://download-v2.springer.com:80/static/pdf/721/art%253A10.1007%252Fs10569-013-9515-6.pdf?
      // token2=exp=1430227746~acl=%2Fstatic%2Fpdf%2F721%2Fart%25253A10.1007%25252Fs10569-013-9515-6.pdf*~hmac=
      // 4fb1e64d78df1281c33d5359415b6e23fa454b613fe4827b45101feb90986375
      result.title_id = match[1];
      result.mime = 'PDF';
      result.unitid = decodeURIComponent(match[3]).substr(1);

      const type = match[2];
      switch (type) {
      case 'art' :
        result.unitid = result.unitid.split('/')[1];
        result.doi   = decodeURIComponent(match[3]).substr(1);
        result.rtype = 'ARTICLE';
        break;
      case 'chp' :
        result.unitid = result.unitid.split('/')[1];
        result.doi   = decodeURIComponent(match[3]).substr(1);
        result.rtype = 'BOOK_SECTION';
        break;
      case 'bok' :
        result.online_identifier = result.unitid;
        result.rtype = 'BOOK';
        break;
      case 'bfm' :
        result.online_identifier = result.unitid.split('/')[0];
        result.rtype = 'TOC';
        break;
      default :
        result.rtype = 'TOC';
        break;
      }
    }
  } else if ((match = /^\/(download|static)\/([a-z]+)\/(([0-9.]*)\/([^/]*)).epub/.exec(path)) !== null) {
    // download/epub/10.1007/978-1-4939-1360-2.epub
    if (/([0-9]+)\.([0-9]+)/.test(match[4])) {
      result.doi      = match[3];
      result.unitid   = match[5] + '.epub';
      result.print_identifier = match[5];
    } else {
      let testunitid = '';
      if ((testunitid = /([\w%]*)[A-Z]{1}([0-9-]+)/.exec(match[5])) !== null) {
        result.unitid   = testunitid[2] + '.epub';
        result.print_identifier = testunitid[2];
      }
    }
    result.rtype    = 'BOOK';
    result.mime     = 'EPUB';
  }
  // title_id can be extracted from the doi
  // /content/pdf/10.1007/s00359-010-0615-4
  //           then 00359 is the pid
  if (result.doi) {
    const title_id = new RegExp('/s([0-9]+)-').exec(result.doi);
    if (title_id && title_id[1]) {
      result.title_id = '' + parseInt(title_id[1], 10); // removes first zeros
    }
  }
  return result;
});
